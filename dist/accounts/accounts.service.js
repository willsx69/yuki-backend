var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
let AccountsService = class AccountsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(userId) {
        return this.prisma.account.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
    }
    async get(userId, id) {
        const acc = await this.prisma.account.findFirst({ where: { id, userId } });
        if (!acc)
            throw new NotFoundException("Conta não encontrada");
        return acc;
    }
    create(userId, dto) {
        return this.prisma.account.create({
            data: {
                userId,
                name: dto.name,
                type: dto.type,
                initialBalanceCents: dto.initialBalanceCents ?? 0,
                institution: dto.institution,
                color: dto.color,
            },
        });
    }
    async update(userId, id, dto) {
        const acc = await this.prisma.account.findFirst({ where: { id, userId } });
        if (!acc)
            throw new NotFoundException("Conta não encontrada");
        return this.prisma.account.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.type !== undefined && { type: dto.type }),
                ...(dto.initialBalanceCents !== undefined && { initialBalanceCents: dto.initialBalanceCents }),
                ...(dto.institution !== undefined && { institution: dto.institution }),
                ...(dto.color !== undefined && { color: dto.color }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
        });
    }
    async archive(userId, id) {
        const acc = await this.prisma.account.findFirst({ where: { id, userId } });
        if (!acc)
            throw new NotFoundException("Conta não encontrada");
        const pendingBills = await this.prisma.bill.count({ where: { accountId: id, status: "pending" } });
        const pendingDebts = await this.prisma.debt.count({ where: { accountId: id, status: "active" } });
        if (pendingBills > 0 || pendingDebts > 0) {
            throw new ForbiddenException("Conta possui obrigações pendentes");
        }
        return this.prisma.account.update({ where: { id }, data: { isActive: false } });
    }
};
AccountsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AccountsService);
export { AccountsService };
//# sourceMappingURL=accounts.service.js.map