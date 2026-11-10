import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

function addFrequency(date: Date, freq: string): Date {
  const d = new Date(date);
  if (freq === "weekly") d.setDate(d.getDate() + 7);
  else if (freq === "monthly") d.setMonth(d.getMonth() + 1);
  else if (freq === "yearly") d.setFullYear(d.getFullYear() + 1);
  return d;
}

@Injectable()
export class RecurrencesService {
  constructor(private prisma: PrismaService) {}

  list(userId: string) { return this.prisma.recurrence.findMany({ where: { userId }, orderBy: { nextOccurrence: "asc" } }); }

  async get(userId: string, id: string) {
    const r = await this.prisma.recurrence.findFirst({ where: { id, userId } });
    if (!r) throw new NotFoundException("Recorrência não encontrada");
    return r;
  }

  async create(userId: string, dto: any) {
    const start = new Date(dto.startDate);
    return this.prisma.recurrence.create({
      data: {
        userId,
        name: dto.name,
        amountCents: dto.amountCents,
        frequency: dto.frequency,
        startDate: start,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        nextOccurrence: start,
        isActive: true,
        categoryId: dto.categoryId,
        accountId: dto.accountId,
        notes: dto.notes,
      },
    });
  }

  async update(userId: string, id: string, dto: any) {
    const r = await this.prisma.recurrence.findFirst({ where: { id, userId } });
    if (!r) throw new NotFoundException("Recorrência não encontrada");
    return this.prisma.recurrence.update({ where: { id }, data: { ...(dto.name && { name: dto.name }), ...(dto.amountCents !== undefined && { amountCents: dto.amountCents }), ...(dto.isActive !== undefined && { isActive: dto.isActive }), ...(dto.notes !== undefined && { notes: dto.notes }) } });
  }

  async pause(userId: string, id: string) {
    const r = await this.prisma.recurrence.findFirst({ where: { id, userId } });
    if (!r) throw new NotFoundException("Recorrência não encontrada");
    return this.prisma.recurrence.update({ where: { id }, data: { isActive: false } });
  }

  async resume(userId: string, id: string) {
    const r = await this.prisma.recurrence.findFirst({ where: { id, userId } });
    if (!r) throw new NotFoundException("Recorrência não encontrada");
    return this.prisma.recurrence.update({ where: { id }, data: { isActive: true } });
  }

  async remove(userId: string, id: string) {
    const r = await this.prisma.recurrence.findFirst({ where: { id, userId } });
    if (!r) throw new NotFoundException("Recorrência não encontrada");
    return this.prisma.recurrence.update({ where: { id }, data: { isActive: false } });
  }

  async generateNext(userId: string, id: string) {
    const r = await this.prisma.recurrence.findFirst({ where: { id, userId } });
    if (!r) throw new NotFoundException("Recorrência não encontrada");
    if (!r.isActive) throw new Error("Recorrência pausada");
    if (r.endDate && r.nextOccurrence > r.endDate) throw new Error("Recorrência encerrada");
    // create bill
    const bill = await this.prisma.bill.create({
      data: {
        userId,
        type: "payable",
        description: r.name,
        amountCents: r.amountCents,
        categoryId: r.categoryId ?? "other-expense",
        accountId: r.accountId!,
        dueDate: r.nextOccurrence,
        status: "pending",
      },
    });
    const next = addFrequency(r.nextOccurrence, r.frequency);
    await this.prisma.recurrence.update({ where: { id }, data: { nextOccurrence: next } });
    return bill;
  }
}