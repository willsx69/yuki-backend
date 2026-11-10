import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateTransactionDto, UpdateTransactionDto } from "./dto/transaction.dto.js";
import { CreditCardsService } from "../credit-cards/credit-cards.service.js";

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService, private cards: CreditCardsService) {}

  async list(userId: string, q: any) {
    const page = Math.max(1, parseInt(q.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(q.limit || "20", 10)));
    const where: any = { userId };
    if (q.type) where.type = q.type;
    if (q.kind) where.kind = q.kind;
    if (q.status) where.status = q.status;
    if (q.categoryId) where.categoryId = q.categoryId;
    if (q.accountId) where.accountId = q.accountId;
    if (q.creditCardId) where.creditCardId = q.creditCardId;
    if (q.paymentMethod) where.paymentMethodId = q.paymentMethod;
    if (q.startDate || q.endDate) {
      where.date = {};
      if (q.startDate) where.date.gte = new Date(q.startDate);
      if (q.endDate) where.date.lte = new Date(q.endDate);
    }
    if (q.minAmount || q.maxAmount) {
      where.amountCents = {};
      if (q.minAmount) where.amountCents.gte = parseInt(q.minAmount, 10);
      if (q.maxAmount) where.amountCents.lte = parseInt(q.maxAmount, 10);
    }
    if (q.search) where.description = { contains: q.search, mode: "insensitive" };

    const [items, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(userId: string, id: string) {
    const t = await this.prisma.transaction.findFirst({ where: { id, userId } });
    if (!t) throw new NotFoundException("Transação não encontrada");
    return t;
  }

  async create(userId: string, dto: CreateTransactionDto) {
    if (dto.accountId) {
      const acc = await this.prisma.account.findFirst({ where: { id: dto.accountId, userId } });
      if (!acc) throw new ForbiddenException("Conta inválida");
    }
    // validate category type compatibility
    const cat = await this.prisma.category.findFirst({ where: { id: dto.categoryId, OR: [{ userId: null }, { userId }] } });
    if (!cat) throw new ForbiddenException("Categoria inválida");
    if (cat.type !== dto.type) throw new BadRequestException("Categoria incompatível com o tipo");

    let invoiceId: string | undefined;
    if (dto.creditCardId) {
      const card = await this.prisma.creditCard.findFirst({ where: { id: dto.creditCardId, userId } });
      if (!card) throw new ForbiddenException("Cartão inválido");
      const purchaseDate = new Date(dto.date);
      const info = this.cards.resolveInvoice(card.id, card, purchaseDate);
      let inv = await this.prisma.creditCardInvoice.findUnique({
        where: { creditCardId_referenceMonth_referenceYear: { creditCardId: card.id, referenceMonth: info.referenceMonth, referenceYear: info.referenceYear } },
      });
      if (!inv) {
        inv = await this.prisma.creditCardInvoice.create({
          data: {
            userId,
            creditCardId: card.id,
            referenceMonth: info.referenceMonth,
            referenceYear: info.referenceYear,
            closingDate: info.closingDate,
            dueDate: info.dueDate,
            status: "open",
          },
        });
      }
      invoiceId = inv.id;
    }

    return this.prisma.transaction.create({
      data: {
        userId,
        type: dto.type as any,
        amountCents: dto.amountCents,
        description: dto.description.trim(),
        categoryId: dto.categoryId,
        date: new Date(dto.date),
        accountId: dto.accountId,
        paymentMethodId: dto.paymentMethodId as any,
        creditCardId: dto.creditCardId,
        invoiceId,
        notes: dto.notes?.trim() || null,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateTransactionDto) {
    const existing = await this.prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException("Transação não encontrada");
    if (existing.status !== "pending") throw new BadRequestException("Apenas transações pendentes podem ser editadas");
    if (dto.accountId) {
      const acc = await this.prisma.account.findFirst({ where: { id: dto.accountId, userId } });
      if (!acc) throw new ForbiddenException("Conta inválida");
    }
    return this.prisma.transaction.update({
      where: { id },
      data: {
        type: dto.type as any,
        amountCents: dto.amountCents,
        description: dto.description.trim(),
        categoryId: dto.categoryId,
        date: new Date(dto.date),
        accountId: dto.accountId,
        paymentMethodId: dto.paymentMethodId as any,
        creditCardId: dto.creditCardId,
        notes: dto.notes?.trim() || null,
      },
    });
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException("Transação não encontrada");
    // soft: cancel if pending, reverse if posted
    if (existing.status === "pending") {
      return this.prisma.transaction.update({ where: { id }, data: { status: "cancelled" } });
    }
    if (existing.status === "posted") {
      return this.reverse(userId, id);
    }
    return existing;
  }

  async cancel(userId: string, id: string) {
    const existing = await this.prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException("Transação não encontrada");
    if (existing.status !== "pending") throw new BadRequestException("Apenas transações pendentes podem ser canceladas");
    return this.prisma.transaction.update({ where: { id }, data: { status: "cancelled" } });
  }

  async reverse(userId: string, id: string) {
    const existing = await this.prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException("Transação não encontrada");
    if (existing.status !== "posted") throw new BadRequestException("Apenas transações efetivadas podem ser estornadas");

    // create reversing transaction
    const reversedType = existing.type === "income" ? "expense" : "income";
    const rev = await this.prisma.transaction.create({
      data: {
        userId,
        type: reversedType as any,
        kind: "adjustment",
        status: "posted",
        amountCents: existing.amountCents,
        description: `Estorno: ${existing.description}`,
        categoryId: existing.categoryId,
        date: new Date(),
        accountId: existing.accountId,
        paymentMethodId: existing.paymentMethodId as any,
        creditCardId: existing.creditCardId,
        invoiceId: existing.invoiceId,
        notes: `Reversal of ${existing.id}`,
      },
    });
    await this.prisma.transaction.update({ where: { id }, data: { status: "reversed" } });
    return rev;
  }

  async summary(userId: string, q: any) {
    const where: any = { userId, status: "posted" };
    if (q.startDate || q.endDate) {
      where.date = {};
      if (q.startDate) where.date.gte = new Date(q.startDate);
      if (q.endDate) where.date.lte = new Date(q.endDate);
    }
    const txs = await this.prisma.transaction.findMany({ where, select: { type: true, kind: true, amountCents: true } });
    let income = 0, expense = 0, invoicePayments = 0;
    for (const t of txs) {
      if (t.kind === "invoice_payment") { invoicePayments += t.amountCents; continue; }
      if (t.kind === "bill_payment") continue;
      if (t.type === "income") income += t.amountCents;
      else {
        expense += t.amountCents;
        if (t.kind === "normal" && t.type === "expense") {
          // card purchases included in expense already if creditCardId; can't distinguish here without field
        }
      }
    }
    return { incomeCents: income, expenseCents: expense, invoicePaymentsCents: invoicePayments, netCents: income - expense };
  }

  async statistics(userId: string, q: any) {
    const where = this.baseWhere(userId, q);
    const txs = await this.prisma.transaction.findMany({ where, select: { type: true, kind: true, amountCents: true } });
    let income = 0, expense = 0, incomeCount = 0, expenseCount = 0;
    for (const t of txs) {
      if (t.kind === "invoice_payment" || t.kind === "bill_payment" || t.kind === "adjustment") continue;
      if (t.type === "income") { income += t.amountCents; incomeCount++; }
      else { expense += t.amountCents; expenseCount++; }
    }
    // card purchases are expenses already counted (they are normal expenses with creditCardId)
    return {
      incomeCents: income,
      expenseCents: expense,
      netCents: income - expense,
      incomeCount,
      expenseCount,
    };
  }

  async statisticsByCategory(userId: string, q: any) {
    const where = this.baseWhere(userId, q);
    if (q.type) where.type = q.type;
    const txs = await this.prisma.transaction.findMany({
      where,
      select: { categoryId: true, amountCents: true, type: true, kind: true, category: { select: { label: true, icon: true, color: true, type: true } } },
    });
    const map = new Map<string, any>();
    let total = 0;
    for (const t of txs) {
      if (t.kind === "invoice_payment" || t.kind === "bill_payment" || t.kind === "adjustment") continue;
      const cur = map.get(t.categoryId) || { categoryId: t.categoryId, name: t.category?.label, icon: t.category?.icon, color: t.category?.color, type: t.category?.type, totalCents: 0, count: 0 };
      cur.totalCents += t.amountCents;
      cur.count += 1;
      map.set(t.categoryId, cur);
      total += t.amountCents;
    }
    const items = Array.from(map.values()).map((i) => ({ ...i, percentage: total > 0 ? Math.round((i.totalCents / total) * 10000) / 100 : 0 }));
    return { totalCents: total, items };
  }

  async statisticsMonthly(userId: string, q: any) {
    const months: { year: number; month: number }[] = [];
    const start = q.startDate ? new Date(q.startDate) : new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1);
    const end = q.endDate ? new Date(q.endDate) : new Date();
    // iterate months
    let cur = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cur <= end) {
      months.push({ year: cur.getFullYear(), month: cur.getMonth() + 1 });
      cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
    }
    const results = [];
    for (const m of months) {
      const from = new Date(m.year, m.month - 1, 1);
      const to = new Date(m.year, m.month, 0);
      const where: any = { userId, status: "posted", date: { gte: from, lte: to } };
      const txs = await this.prisma.transaction.findMany({ where, select: { type: true, kind: true, amountCents: true } });
      let income = 0, expense = 0;
      for (const t of txs) {
        if (t.kind === "invoice_payment" || t.kind === "bill_payment" || t.kind === "adjustment") continue;
        if (t.type === "income") income += t.amountCents;
        else expense += t.amountCents;
      }
      results.push({ year: m.year, month: m.month, incomeCents: income, expenseCents: expense, netCents: income - expense });
    }
    return results;
  }

  private baseWhere(userId: string, q: any) {
    const where: any = { userId, status: "posted" };
    if (q.startDate || q.endDate) {
      where.date = {};
      if (q.startDate) where.date.gte = new Date(q.startDate);
      if (q.endDate) where.date.lte = new Date(q.endDate);
    }
    if (q.type) where.type = q.type;
    return where;
  }
}