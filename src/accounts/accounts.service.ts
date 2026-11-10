import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateAccountDto } from "./dto/create-account.dto.js";
import { UpdateAccountDto } from "./dto/update-account.dto.js";

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.account.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
  }

  async get(userId: string, id: string) {
    const acc = await this.prisma.account.findFirst({ where: { id, userId } });
    if (!acc) throw new NotFoundException("Conta não encontrada");
    return acc;
  }

  create(userId: string, dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        userId,
        name: dto.name,
        type: dto.type as any,
        initialBalanceCents: dto.initialBalanceCents ?? 0,
        institution: dto.institution,
        color: dto.color,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateAccountDto) {
    const acc = await this.prisma.account.findFirst({ where: { id, userId } });
    if (!acc) throw new NotFoundException("Conta não encontrada");
    return this.prisma.account.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.type !== undefined && { type: dto.type as any }),
        ...(dto.initialBalanceCents !== undefined && { initialBalanceCents: dto.initialBalanceCents }),
        ...(dto.institution !== undefined && { institution: dto.institution }),
        ...(dto.color !== undefined && { color: dto.color }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  async archive(userId: string, id: string) {
    const acc = await this.prisma.account.findFirst({ where: { id, userId } });
    if (!acc) throw new NotFoundException("Conta não encontrada");
    // Block archive if pending obligations
    const pendingBills = await this.prisma.bill.count({ where: { accountId: id, status: "pending" } });
    const pendingDebts = await this.prisma.debt.count({ where: { accountId: id, status: "active" } });
    if (pendingBills > 0 || pendingDebts > 0) {
      throw new ForbiddenException("Conta possui obrigações pendentes");
    }
    return this.prisma.account.update({ where: { id }, data: { isActive: false } });
  }
}