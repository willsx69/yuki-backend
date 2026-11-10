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
import { BalanceService } from "../accounts/balance.service.js";
import { AccountsService } from "../accounts/accounts.service.js";
let DashboardService = class DashboardService {
    prisma;
    balance;
    accounts;
    constructor(prisma, balance, accounts) {
        this.prisma = prisma;
        this.balance = balance;
        this.accounts = accounts;
    }
    async overview(userId) {
        const accounts = await this.prisma.account.findMany({ where: { userId, isActive: true } });
        let totalCents = 0;
        const accountBalances = [];
        for (const a of accounts) {
            const b = await this.balance.calculateAccountBalance(a.id, userId);
            totalCents += b.balanceCents;
            accountBalances.push({ id: a.id, name: a.name, institution: a.institution, type: a.type, color: a.color, balanceCents: b.balanceCents });
        }
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const startPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endPrev = new Date(now.getFullYear(), now.getMonth(), 0);
        const txs = await this.prisma.transaction.findMany({ where: { userId, status: "posted", date: { gte: startOfMonth, lte: endOfMonth } }, select: { type: true, kind: true, amountCents: true } });
        let incomeCents = 0, expenseCents = 0, incomeCount = 0, expenseCount = 0;
        for (const t of txs) {
            if (t.kind === "invoice_payment" || t.kind === "bill_payment" || t.kind === "adjustment")
                continue;
            if (t.type === "income") {
                incomeCents += t.amountCents;
                incomeCount++;
            }
            else {
                expenseCents += t.amountCents;
                expenseCount++;
            }
        }
        const prevTxs = await this.prisma.transaction.findMany({ where: { userId, status: "posted", date: { gte: startPrev, lte: endPrev } }, select: { type: true, kind: true, amountCents: true } });
        let prevIncome = 0, prevExpense = 0;
        for (const t of prevTxs) {
            if (t.kind === "invoice_payment" || t.kind === "bill_payment" || t.kind === "adjustment")
                continue;
            if (t.type === "income")
                prevIncome += t.amountCents;
            else
                prevExpense += t.amountCents;
        }
        const incomeChangePercent = prevIncome > 0 ? Math.round(((incomeCents - prevIncome) / prevIncome) * 10000) / 100 : 0;
        const expenseChangePercent = prevExpense > 0 ? Math.round(((expenseCents - prevExpense) / prevExpense) * 10000) / 100 : 0;
        const recentTransactions = await this.prisma.transaction.findMany({ where: { userId }, orderBy: [{ date: "desc" }, { createdAt: "desc" }], take: 10, select: { id: true, description: true, amountCents: true, type: true, date: true, categoryId: true, accountId: true, creditCardId: true, paymentMethodId: true } });
        const upcomingBills = await this.prisma.bill.findMany({ where: { userId, status: "pending", dueDate: { gte: now } }, orderBy: { dueDate: "asc" }, take: 10 });
        const creditCards = await this.prisma.creditCard.findMany({ where: { userId, isActive: true }, select: { id: true, name: true, brand: true, lastFourDigits: true, creditLimitCents: true, closingDay: true, dueDay: true } });
        const activeDebts = await this.prisma.debt.findMany({ where: { userId, status: "active" } });
        const pendingInstallments = await this.prisma.installment.findMany({ where: { userId, status: "pending" } });
        const paidThisMonthInstallments = await this.prisma.installment.count({ where: { userId, status: "paid", paidAt: { gte: startOfMonth, lte: endOfMonth } } });
        const pendingInstallmentTotal = pendingInstallments.reduce((s, i) => s + i.amountCents, 0);
        const activeRecurrences = await this.prisma.recurrence.findMany({ where: { userId, isActive: true } });
        const recurrenceTotalCents = activeRecurrences.reduce((s, r) => s + r.amountCents, 0);
        const nextDue = pendingInstallments
            .filter((i) => i.dueDate >= now)
            .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
            .slice(0, 5);
        return {
            balance: { totalCents, accountsCount: accounts.length, accounts: accountBalances },
            monthly: { incomeCents, expenseCents, netCents: incomeCents - expenseCents, incomeCount, expenseCount },
            comparison: { incomeChangePercent, expenseChangePercent },
            recentTransactions,
            upcomingBills,
            creditCards,
            debts: {
                activeCount: activeDebts.length,
                remainingCents: pendingInstallmentTotal,
                pendingInstallmentsCount: pendingInstallments.length,
                paidThisMonthCount: paidThisMonthInstallments,
                nextDue,
            },
            recurrences: {
                activeCount: activeRecurrences.length,
                monthlyTotalCents: recurrenceTotalCents,
            },
            futureCommitmentsCents: pendingInstallmentTotal + recurrenceTotalCents,
        };
    }
    async evolution(userId, q) {
        const start = q.startDate ? new Date(q.startDate) : new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1);
        const end = q.endDate ? new Date(q.endDate) : new Date();
        const groupBy = q.groupBy || "month";
        const results = [];
        let cur = new Date(start);
        if (groupBy === "month") {
            cur = new Date(start.getFullYear(), start.getMonth(), 1);
            while (cur <= end) {
                const from = new Date(cur.getFullYear(), cur.getMonth(), 1);
                const to = new Date(cur.getFullYear(), cur.getMonth() + 1, 0);
                const txs = await this.prisma.transaction.findMany({ where: { userId, status: "posted", date: { gte: from, lte: to } }, select: { type: true, kind: true, amountCents: true } });
                let income = 0, expense = 0;
                for (const t of txs) {
                    if (t.kind === "invoice_payment" || t.kind === "bill_payment" || t.kind === "adjustment")
                        continue;
                    if (t.type === "income")
                        income += t.amountCents;
                    else
                        expense += t.amountCents;
                }
                results.push({ period: `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}`, incomeCents: income, expenseCents: expense, netCents: income - expense });
                cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
            }
        }
        else {
            cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            while (cur <= end) {
                const from = new Date(cur);
                const txs = await this.prisma.transaction.findMany({ where: { userId, status: "posted", date: from }, select: { type: true, kind: true, amountCents: true } });
                let income = 0, expense = 0;
                for (const t of txs) {
                    if (t.kind === "invoice_payment" || t.kind === "bill_payment" || t.kind === "adjustment")
                        continue;
                    if (t.type === "income")
                        income += t.amountCents;
                    else
                        expense += t.amountCents;
                }
                results.push({ period: cur.toISOString().slice(0, 10), incomeCents: income, expenseCents: expense, netCents: income - expense });
                cur.setDate(cur.getDate() + 1);
            }
        }
        return results;
    }
    async categories(userId, q) {
        const where = { userId, status: "posted" };
        if (q.startDate || q.endDate) {
            where.date = {};
            if (q.startDate)
                where.date.gte = new Date(q.startDate);
            if (q.endDate)
                where.date.lte = new Date(q.endDate);
        }
        const txs = await this.prisma.transaction.findMany({ where, select: { categoryId: true, amountCents: true, kind: true, category: { select: { label: true, icon: true, color: true } } } });
        const map = new Map();
        let total = 0;
        for (const t of txs) {
            if (t.kind === "invoice_payment" || t.kind === "bill_payment" || t.kind === "adjustment")
                continue;
            const cur = map.get(t.categoryId) || { categoryId: t.categoryId, name: t.category?.label, icon: t.category?.icon, color: t.category?.color, totalCents: 0, count: 0 };
            cur.totalCents += t.amountCents;
            cur.count += 1;
            map.set(t.categoryId, cur);
            total += t.amountCents;
        }
        return Array.from(map.values()).map((i) => ({ ...i, percentage: total > 0 ? Math.round((i.totalCents / total) * 10000) / 100 : 0 }));
    }
    async recentTransactions(userId, limit = 10) {
        const take = Math.min(50, Math.max(1, limit));
        return this.prisma.transaction.findMany({ where: { userId }, orderBy: [{ date: "desc" }, { createdAt: "desc" }], take, select: { id: true, description: true, amountCents: true, type: true, date: true, categoryId: true, accountId: true, creditCardId: true, paymentMethodId: true } });
    }
    async upcomingBills(userId) {
        const now = new Date();
        const bills = await this.prisma.bill.findMany({ where: { userId, status: "pending" }, orderBy: { dueDate: "asc" } });
        const overdue = bills.filter((b) => b.dueDate < now);
        const upcoming = bills.filter((b) => b.dueDate >= now);
        return { overdue, upcoming, payable: bills.filter((b) => b.type === "payable"), receivable: bills.filter((b) => b.type === "receivable") };
    }
    async creditCards(userId) {
        const cards = await this.prisma.creditCard.findMany({ where: { userId, isActive: true } });
        const result = [];
        for (const c of cards) {
            const invs = await this.prisma.creditCardInvoice.findMany({ where: { creditCardId: c.id, status: { in: ["open", "closed"] } } });
            let used = 0;
            for (const inv of invs) {
                const agg = await this.prisma.transaction.aggregate({ where: { invoiceId: inv.id }, _sum: { amountCents: true } });
                used += agg._sum.amountCents ?? 0;
            }
            result.push({ id: c.id, name: c.name, brand: c.brand, lastFourDigits: c.lastFourDigits, creditLimitCents: c.creditLimitCents, usedCents: used, availableCents: c.creditLimitCents - used, closingDay: c.closingDay, dueDay: c.dueDay });
        }
        return result;
    }
};
DashboardService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService, BalanceService, AccountsService])
], DashboardService);
export { DashboardService };
//# sourceMappingURL=dashboard.service.js.map