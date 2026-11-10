var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
function addMonths(date, months) {
    const d = new Date(date);
    const day = d.getDate();
    d.setMonth(d.getMonth() + months);
    if (d.getDate() < day)
        d.setDate(0);
    return d;
}
let DebtsService = class DebtsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(userId) {
        return this.prisma.debt.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    }
    async get(userId, id) {
        const d = await this.prisma.debt.findFirst({ where: { id, userId } });
        if (!d)
            throw new NotFoundException("Dívida não encontrada");
        return d;
    }
    async create(userId, dto) {
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
    async installments(userId, debtId) {
        const d = await this.prisma.debt.findFirst({ where: { id: debtId, userId } });
        if (!d)
            throw new NotFoundException("Dívida não encontrada");
        return this.prisma.installment.findMany({ where: { debtId, userId }, orderBy: { number: "asc" } });
    }
    async payInstallment(userId, installmentId, accountId) {
        const inst = await this.prisma.installment.findFirst({ where: { id: installmentId, userId } });
        if (!inst)
            throw new NotFoundException("Parcela não encontrada");
        if (inst.status === "paid")
            throw new BadRequestException("Parcela já paga");
        const account = await this.prisma.account.findFirst({ where: { id: accountId, userId } });
        if (!account)
            throw new ForbiddenException("Conta inválida");
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.installment.updateMany({ where: { id: installmentId, status: "pending" }, data: { status: "paid", paidAt: new Date() } });
            if (updated.count === 0)
                throw new BadRequestException("Parcela já paga");
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
            const remaining = await tx.installment.count({ where: { debtId: inst.debtId, status: "pending" } });
            if (remaining === 0) {
                await tx.debt.update({ where: { id: inst.debtId }, data: { status: "settled", closedAt: new Date() } });
            }
            return { paid: true, transactionId: txRec.id };
        });
    }
    async update(userId, id, dto) {
        const d = await this.prisma.debt.findFirst({ where: { id, userId } });
        if (!d)
            throw new NotFoundException("Dívida não encontrada");
        return this.prisma.debt.update({ where: { id }, data: { ...(dto.name && { name: dto.name }), ...(dto.notes !== undefined && { notes: dto.notes }), ...(dto.status && { status: dto.status }) } });
    }
    async remove(userId, id) {
        const d = await this.prisma.debt.findFirst({ where: { id, userId } });
        if (!d)
            throw new NotFoundException("Dívida não encontrada");
        return this.prisma.debt.update({ where: { id }, data: { status: "cancelled" } });
    }
};
DebtsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], DebtsService);
export { DebtsService };
//# sourceMappingURL=debts.service.js.map