import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class BalanceService {
  constructor(private prisma: PrismaService) {}

  async calculateAccountBalance(accountId: string, userId: string) {
    const account = await this.prisma.account.findFirst({ where: { id: accountId, userId } });
    if (!account) throw new Error("Conta não encontrada");

    const txs = await this.prisma.transaction.findMany({
      where: { accountId, userId, status: "posted" },
      select: { type: true, amountCents: true, kind: true },
    });

    let balance = account.initialBalanceCents;
    for (const t of txs) {
      if (t.type === "income") balance += t.amountCents;
      else balance -= t.amountCents;
    }
    return { accountId, balanceCents: balance };
  }
}