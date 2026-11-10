var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
let TransactionsService = class TransactionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(userId) {
        return this.prisma.transaction.findMany({
            where: { userId },
            orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        });
    }
    create(userId, dto) {
        return this.prisma.transaction.create({
            data: {
                userId,
                type: dto.type,
                amountCents: dto.amountCents,
                description: dto.description.trim(),
                categoryId: dto.categoryId,
                date: new Date(dto.date),
                accountId: dto.accountId,
                paymentMethodId: dto.paymentMethodId,
                notes: dto.notes?.trim() || null,
            },
        });
    }
    async update(userId, id, dto) {
        const existing = await this.prisma.transaction.findFirst({ where: { id, userId } });
        if (!existing)
            throw new Error("Transação não encontrada");
        return this.prisma.transaction.update({
            where: { id },
            data: {
                type: dto.type,
                amountCents: dto.amountCents,
                description: dto.description.trim(),
                categoryId: dto.categoryId,
                date: new Date(dto.date),
                accountId: dto.accountId,
                paymentMethodId: dto.paymentMethodId,
                notes: dto.notes?.trim() || null,
            },
        });
    }
    async remove(userId, id) {
        const existing = await this.prisma.transaction.findFirst({ where: { id, userId } });
        if (!existing)
            throw new Error("Transação não encontrada");
        await this.prisma.transaction.delete({ where: { id } });
    }
};
TransactionsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], TransactionsService);
export { TransactionsService };
//# sourceMappingURL=transactions.service.js.map