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
import { ReportsService } from "../reports/reports.service.js";
let InsightsService = class InsightsService {
    prisma;
    reports;
    constructor(prisma, reports) {
        this.prisma = prisma;
        this.reports = reports;
    }
    async overview(userId) {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const summary = await this.reports.summary(userId, { startDate: start.toISOString(), endDate: end.toISOString() });
        const prevSummary = await this.reports.summary(userId, { startDate: prevStart.toISOString(), endDate: prevEnd.toISOString() });
        const pendingInstallments = await this.prisma.installment.findMany({ where: { userId, status: "pending" } });
        const activeDebts = await this.prisma.debt.findMany({ where: { userId, status: "active" } });
        const recurrences = await this.prisma.recurrence.findMany({ where: { userId, isActive: true } });
        const income = summary.incomeCents;
        const expense = summary.expenseCents;
        const committed = income > 0 ? Math.round((expense / income) * 10000) / 100 : 0;
        return {
            month: { incomeCents: income, expenseCents: expense, netCents: summary.netCents },
            previousMonth: { incomeCents: prevSummary.incomeCents, expenseCents: prevSummary.expenseCents, netCents: prevSummary.netCents },
            changes: summary.changePercent,
            committedIncomePercent: committed,
            debts: { activeCount: activeDebts.length, remainingCents: pendingInstallments.reduce((s, i) => s + i.amountCents, 0) },
            recurrences: { activeCount: recurrences.length, monthlyCents: recurrences.reduce((s, r) => s + r.amountCents, 0) },
            futureCommitmentsCents: pendingInstallments.reduce((s, i) => s + i.amountCents, 0) + recurrences.reduce((s, r) => s + r.amountCents, 0),
        };
    }
    async alerts(userId) {
        const now = new Date();
        const alerts = [];
        const bills = await this.prisma.bill.findMany({ where: { userId, status: "pending" } });
        for (const b of bills) {
            const days = Math.ceil((b.dueDate.getTime() - now.getTime()) / 86400000);
            if (days < 0)
                alerts.push({ type: "overdue_bill", title: "Conta vencida", description: b.description, priority: "high", date: b.dueDate, amountCents: b.amountCents });
            else if (days <= 7)
                alerts.push({ type: "upcoming_bill", title: "Conta próxima do vencimento", description: b.description, priority: "medium", date: b.dueDate, amountCents: b.amountCents });
        }
        const insts = await this.prisma.installment.findMany({ where: { userId, status: "pending" } });
        for (const i of insts) {
            const days = Math.ceil((i.dueDate.getTime() - now.getTime()) / 86400000);
            if (days < 0)
                alerts.push({ type: "overdue_installment", title: "Parcela vencida", description: `Parcela ${i.number}`, priority: "high", date: i.dueDate, amountCents: i.amountCents });
            else if (days <= 7)
                alerts.push({ type: "upcoming_installment", title: "Parcela próxima do vencimento", description: `Parcela ${i.number}`, priority: "medium", date: i.dueDate, amountCents: i.amountCents });
        }
        const overview = await this.overview(userId);
        if (overview.committedIncomePercent > 80) {
            alerts.push({ type: "high_commitment", title: "Renda muito comprometida", description: `Comprometimento de ${overview.committedIncomePercent}%`, priority: "high", amountCents: overview.month.expenseCents });
        }
        if (overview.month.expenseCents > overview.month.incomeCents && overview.month.incomeCents > 0) {
            alerts.push({ type: "expenses_exceed_income", title: "Despesas superam receitas", description: "Gastos do mês maiores que receitas", priority: "high", amountCents: overview.month.expenseCents - overview.month.incomeCents });
        }
        const activeDebts = await this.prisma.debt.findMany({ where: { userId, status: "active" } });
        for (const d of activeDebts) {
            alerts.push({ type: "remaining_debt", title: "Dívida ativa", description: d.name, priority: "low", amountCents: d.totalOriginalCents ?? 0 });
        }
        return alerts;
    }
    async recommendations(userId) {
        const recs = [];
        const overview = await this.overview(userId);
        if (overview.committedIncomePercent > 70) {
            recs.push({ type: "reduce_commitment", title: "Reduzir comprometimento de renda", description: `Seu comprometimento está em ${overview.committedIncomePercent}%. Considere reduzir gastos.`, data: { committedPercent: overview.committedIncomePercent } });
        }
        const cats = await this.reports.categories(userId, {});
        const top = cats.items.sort((a, b) => b.totalCents - a.totalCents)[0];
        if (top && top.percentage > 40) {
            const savings = Math.round(top.totalCents * 0.1);
            recs.push({ type: "reduce_category", title: `Reduzir gastos em ${top.name}`, description: `${top.name} representa ${top.percentage}% das despesas. Reduzir 10% economizaria ${savings} centavos.`, data: { categoryId: top.categoryId, percentage: top.percentage, potentialSavingsCents: savings } });
        }
        if (overview.futureCommitmentsCents > overview.month.incomeCents && overview.month.incomeCents > 0) {
            recs.push({ type: "future_commitments", title: "Compromissos futuros elevados", description: "Compromissos futuros superam a receita mensal.", data: { futureCommitmentsCents: overview.futureCommitmentsCents, incomeCents: overview.month.incomeCents } });
        }
        return recs;
    }
    async spendingPatterns(userId) {
        const cats = await this.reports.categories(userId, {});
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        const prevCats = await this.reports.categories(userId, { startDate: start.toISOString(), endDate: end.toISOString() });
        const increases = [];
        for (const c of cats.items) {
            const prev = prevCats.items.find((p) => p.categoryId === c.categoryId);
            if (prev && prev.totalCents > 0) {
                const change = Math.round(((c.totalCents - prev.totalCents) / prev.totalCents) * 10000) / 100;
                if (change > 20)
                    increases.push({ categoryId: c.categoryId, name: c.name, changePercent: change });
            }
        }
        return { topCategories: cats.items.slice(0, 5), increases };
    }
};
InsightsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService, ReportsService])
], InsightsService);
export { InsightsService };
//# sourceMappingURL=insights.service.js.map