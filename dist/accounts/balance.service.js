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
let BalanceService = class BalanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async calculateAccountBalance(accountId, userId) {
        const account = await this.prisma.account.findFirst({ where: { id: accountId, userId } });
        if (!account)
            throw new Error("Conta não encontrada");
        const txs = await this.prisma.transaction.findMany({
            where: { accountId, userId, status: "posted" },
            select: { type: true, amountCents: true, kind: true },
        });
        let balance = account.initialBalanceCents;
        for (const t of txs) {
            if (t.type === "income")
                balance += t.amountCents;
            else
                balance -= t.amountCents;
        }
        return { accountId, balanceCents: balance };
    }
};
BalanceService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], BalanceService);
export { BalanceService };
//# sourceMappingURL=balance.service.js.map