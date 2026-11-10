import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateCreditCardDto } from "./dto/create-credit-card.dto.js";
import { UpdateCreditCardDto } from "./dto/update-credit-card.dto.js";
import { PayInvoiceDto } from "./dto/pay-invoice.dto.js";

function clampDay(year: number, month: number, day: number): Date {
  const last = new Date(year, month, 0).getDate();
  const d = Math.min(day, last);
  return new Date(year, month - 1, d);
}

function closingDateFor(card: { closingDay: number }, purchaseDate: Date): Date {
  const y = purchaseDate.getFullYear();
  const m = purchaseDate.getMonth() + 1;
  const day = purchaseDate.getDate();
  if (day <= card.closingDay) {
    return clampDay(y, m, card.closingDay);
  }
  // next month
  let nm = m + 1;
  let ny = y;
  if (nm > 12) { nm = 1; ny++; }
  return clampDay(ny, nm, card.closingDay);
}

function dueDateFor(card: { dueDay: number }, closingDate: Date): Date {
  const y = closingDate.getFullYear();
  const m = closingDate.getMonth() + 1;
  // due in the month after closing
  let dm = m + 1;
  let dy = y;
  if (dm > 12) { dm = 1; dy++; }
  return clampDay(dy, dm, card.dueDay);
}

@Injectable()
export class CreditCardsService {
  constructor(private prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.creditCard.findMany({ where: { userId, isActive: true }, orderBy: { createdAt: "asc" } });
  }

  async get(userId: string, id: string) {
    const c = await this.prisma.creditCard.findFirst({ where: { id, userId } });
    if (!c) throw new NotFoundException("Cartão não encontrado");
    return c;
  }

  create(userId: string, dto: CreateCreditCardDto) {
    return this.prisma.creditCard.create({
      data: {
        userId,
        name: dto.name,
        brand: dto.brand,
        lastFourDigits: dto.lastFourDigits,
        creditLimitCents: dto.creditLimitCents,
        closingDay: dto.closingDay,
        dueDay: dto.dueDay,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateCreditCardDto) {
    const c = await this.prisma.creditCard.findFirst({ where: { id, userId } });
    if (!c) throw new NotFoundException("Cartão não encontrado");
    return this.prisma.creditCard.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.brand !== undefined && { brand: dto.brand }),
        ...(dto.lastFourDigits !== undefined && { lastFourDigits: dto.lastFourDigits }),
        ...(dto.creditLimitCents !== undefined && { creditLimitCents: dto.creditLimitCents }),
        ...(dto.closingDay !== undefined && { closingDay: dto.closingDay }),
        ...(dto.dueDay !== undefined && { dueDay: dto.dueDay }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  async archive(userId: string, id: string) {
    const c = await this.prisma.creditCard.findFirst({ where: { id, userId } });
    if (!c) throw new NotFoundException("Cartão não encontrado");
    return this.prisma.creditCard.update({ where: { id }, data: { isActive: false } });
  }

  async listInvoices(userId: string, cardId: string) {
    const c = await this.prisma.creditCard.findFirst({ where: { id: cardId, userId } });
    if (!c) throw new NotFoundException("Cartão não encontrado");
    return this.prisma.creditCardInvoice.findMany({
      where: { creditCardId: cardId, userId },
      orderBy: [{ referenceYear: "desc" }, { referenceMonth: "desc" }],
    });
  }

  async getInvoice(userId: string, invoiceId: string) {
    const inv = await this.prisma.creditCardInvoice.findFirst({ where: { id: invoiceId, userId } });
    if (!inv) throw new NotFoundException("Fatura não encontrada");
    return inv;
  }

  async getInvoiceTransactions(userId: string, invoiceId: string) {
    const inv = await this.prisma.creditCardInvoice.findFirst({ where: { id: invoiceId, userId } });
    if (!inv) throw new NotFoundException("Fatura não encontrada");
    return this.prisma.transaction.findMany({ where: { invoiceId, userId }, orderBy: { date: "desc" } });
  }

  invoiceTotal(invoiceId: string) {
    return this.prisma.transaction.aggregate({ where: { invoiceId }, _sum: { amountCents: true } });
  }

  async payInvoice(userId: string, invoiceId: string, dto: PayInvoiceDto) {
    const invoice = await this.prisma.creditCardInvoice.findFirst({ where: { id: invoiceId, userId } });
    if (!invoice) throw new NotFoundException("Fatura não encontrada");
    if (invoice.status === "paid") throw new BadRequestException("Fatura já paga");

    const account = await this.prisma.account.findFirst({ where: { id: dto.accountId, userId } });
    if (!account) throw new NotFoundException("Conta não encontrada");

    const agg = await this.prisma.transaction.aggregate({ where: { invoiceId, userId }, _sum: { amountCents: true } });
    const total = agg._sum.amountCents ?? 0;
    if (total <= 0) throw new BadRequestException("Fatura sem valor");

    return this.prisma.$transaction(async (tx) => {
      // lock invoice row by updating status conditionally
      const updated = await tx.creditCardInvoice.updateMany({
        where: { id: invoiceId, status: { not: "paid" } },
        data: { status: "paid", paidAt: new Date() },
      });
      if (updated.count === 0) throw new BadRequestException("Fatura já paga");

      await tx.transaction.create({
        data: {
          userId,
          type: "expense",
          kind: "invoice_payment",
          amountCents: total,
          description: `Pagamento de fatura`,
          categoryId: (await tx.category.findFirst({ where: { id: "other-expense" } }))?.id ?? "other-expense",
          date: new Date(),
          accountId: dto.accountId,
          paymentMethodId: "bank_transfer",
          invoiceId,
        },
      });

      return { paid: true, amountCents: total };
    });
  }

  // helper used by transactions service to assign invoice
  resolveInvoice(cardId: string, card: { closingDay: number; dueDay: number }, purchaseDate: Date) {
    const closing = closingDateFor(card, purchaseDate);
    const due = dueDateFor(card, closing);
    return { closingDate: closing, dueDate: due, referenceMonth: closing.getMonth() + 1, referenceYear: closing.getFullYear() };
  }
}