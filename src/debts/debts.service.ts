import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) d.setDate(0);
  return d;
}

@Injectable()
export class DebtsService {
  constructor(private prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.debt.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  }

  async get(userId: string, id: string) {
    const d = await this.prisma.debt.findFirst({ where: { id, userId } });
    if (!d) throw new NotFoundException("Dívida não encontrada");
    return d;
  }

  async create(userId: string, dto: any) {
    const total = dto.totalOriginalCents ?? dto.installmentCents * dto.totalInstallments;
    const debt = await this.prisma.debt.create({
      data: {
        userId,
        name: dto.name,
        creditor: dto.creditor,
        totalOriginalCents: total,
        installmentCents: dto.installmentCents,
        totalInstallments: dto.totalInstallments,
        initialPaidInstallments: dto.initialPaidInstallments ?? 0,
        firstPendingDueDate: new Date(dto.firstPendingDueDate),
        periodicity: dto.periodicity ?? "monthly",
        categoryId: dto.categoryId,
        accountId: dto.accountId,
        notes: dto.notes,
      },
    });
    // generate installments
    const startPaid = dto.initialPaidInstallments ?? 0;
    const installments = [];
    for (let i = 1; i <= dto.totalInstallments; i++) {
      const due = addMonths(new Date(dto.firstPendingDueDate), i - 1 - startPaid);
      installments.push({
        userId,
        debtId: debt.id,
        number: i,
        amountCents: dto.installmentCents,
        dueDate: due,
        status: i <= startPaid ? "paid" : "pending",
      });
    }
    await this.prisma.installment.createMany({ data: installments });
    return debt;
  }

  async installments(userId: string, debtId: string) {
    const d = await this.prisma.debt.findFirst({ where: { id: debtId, userId } });
    if (!d) throw new NotFoundException("Dívida não encontrada");
    return this.prisma.installment.findMany({ where: { debtId, userId }, orderBy: { number: "asc" } });
  }

  async payInstallment(userId: string, installmentId: string, accountId: string) {
    const inst = await this.prisma.installment.findFirst({ where: { id: installmentId, userId } });
    if (!inst) throw new NotFoundException("Parcela não encontrada");
    if (inst.status === "paid") throw new BadRequestException("Parcela já paga");

    const account = await this.prisma.account.findFirst({ where: { id: accountId, userId } });
    if (!account) throw new ForbiddenException("Conta inválida");

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.installment.updateMany({ where: { id: installmentId, status: "pending" }, data: { status: "paid", paidAt: new Date() } });
      if (updated.count === 0) throw new BadRequestException("Parcela já paga");

      const txRec = await tx.transaction.create({
        data: {
          userId,
          type: "expense",
          kind: "bill_payment",
          status: "posted",
          amountCents: inst.amountCents,
          description: `Pagamento de parcela`,
          categoryId: (await tx.category.findFirst({ where: { id: "other-expense" } }))?.id ?? "other-expense",
          date: new Date(),
          accountId,
          paymentMethodId: "bank_transfer",
        },
      });
      await tx.installment.update({ where: { id: installmentId }, data: { transactionId: txRec.id } });

      // update debt status if all paid
      const remaining = await tx.installment.count({ where: { debtId: inst.debtId, status: "pending" } });
      if (remaining === 0) {
        await tx.debt.update({ where: { id: inst.debtId }, data: { status: "settled", closedAt: new Date() } });
      }
      return { paid: true, transactionId: txRec.id };
    });
  }

  async update(userId: string, id: string, dto: any) {
    const d = await this.prisma.debt.findFirst({ where: { id, userId } });
    if (!d) throw new NotFoundException("Dívida não encontrada");
    return this.prisma.debt.update({ where: { id }, data: { ...(dto.name && { name: dto.name }), ...(dto.notes !== undefined && { notes: dto.notes }), ...(dto.status && { status: dto.status }) } });
  }

  async remove(userId: string, id: string) {
    const d = await this.prisma.debt.findFirst({ where: { id, userId } });
    if (!d) throw new NotFoundException("Dívida não encontrada");
    return this.prisma.debt.update({ where: { id }, data: { status: "cancelled" } });
  }
}