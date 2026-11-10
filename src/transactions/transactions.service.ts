import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateTransactionDto, UpdateTransactionDto } from "./dto/transaction.dto.js";

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
  }

  create(userId: string, dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        userId,
        type: dto.type as any,
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

  async update(userId: string, id: string, dto: UpdateTransactionDto) {
    const existing = await this.prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) throw new Error("Transação não encontrada");
    return this.prisma.transaction.update({
      where: { id },
      data: {
        type: dto.type as any,
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

  async remove(userId: string, id: string) {
    const existing = await this.prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) throw new Error("Transação não encontrada");
    await this.prisma.transaction.delete({ where: { id } });
  }
}