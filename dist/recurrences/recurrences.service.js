var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
function addFrequency(date, freq) {
    const d = new Date(date);
    if (freq === "weekly")
        d.setDate(d.getDate() + 7);
    else if (freq === "monthly")
        d.setMonth(d.getMonth() + 1);
    else if (freq === "yearly")
        d.setFullYear(d.getFullYear() + 1);
    return d;
}
let RecurrencesService = class RecurrencesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(userId) { return this.prisma.recurrence.findMany({ where: { userId }, orderBy: { nextOccurrence: "asc" } }); }
    async get(userId, id) {
        const r = await this.prisma.recurrence.findFirst({ where: { id, userId } });
        if (!r)
            throw new NotFoundException("Recorrência não encontrada");
        return r;
    }
    async create(userId, dto) {
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
    async update(userId, id, dto) {
        const r = await this.prisma.recurrence.findFirst({ where: { id, userId } });
        if (!r)
            throw new NotFoundException("Recorrência não encontrada");
        return this.prisma.recurrence.update({ where: { id }, data: { ...(dto.name && { name: dto.name }), ...(dto.amountCents !== undefined && { amountCents: dto.amountCents }), ...(dto.isActive !== undefined && { isActive: dto.isActive }), ...(dto.notes !== undefined && { notes: dto.notes }) } });
    }
    async pause(userId, id) {
        const r = await this.prisma.recurrence.findFirst({ where: { id, userId } });
        if (!r)
            throw new NotFoundException("Recorrência não encontrada");
        return this.prisma.recurrence.update({ where: { id }, data: { isActive: false } });
    }
    async resume(userId, id) {
        const r = await this.prisma.recurrence.findFirst({ where: { id, userId } });
        if (!r)
            throw new NotFoundException("Recorrência não encontrada");
        return this.prisma.recurrence.update({ where: { id }, data: { isActive: true } });
    }
    async remove(userId, id) {
        const r = await this.prisma.recurrence.findFirst({ where: { id, userId } });
        if (!r)
            throw new NotFoundException("Recorrência não encontrada");
        return this.prisma.recurrence.update({ where: { id }, data: { isActive: false } });
    }
    async generateNext(userId, id) {
        const r = await this.prisma.recurrence.findFirst({ where: { id, userId } });
        if (!r)
            throw new NotFoundException("Recorrência não encontrada");
        if (!r.isActive)
            throw new Error("Recorrência pausada");
        if (r.endDate && r.nextOccurrence > r.endDate)
            throw new Error("Recorrência encerrada");
        const bill = await this.prisma.bill.create({
            data: {
                userId,
                type: "payable",
                description: r.name,
                amountCents: r.amountCents,
                categoryId: r.categoryId ?? "other-expense",
                accountId: r.accountId,
                dueDate: r.nextOccurrence,
                status: "pending",
            },
        });
        const next = addFrequency(r.nextOccurrence, r.frequency);
        await this.prisma.recurrence.update({ where: { id }, data: { nextOccurrence: next } });
        return bill;
    }
};
RecurrencesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], RecurrencesService);
export { RecurrencesService };
//# sourceMappingURL=recurrences.service.js.map