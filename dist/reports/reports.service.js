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
let ReportsService = class ReportsService {
    prisma;
    balance;
    constructor(prisma, balance) {
        this.prisma = prisma;
        this.balance = balance;
    }
    baseWhere(userId, q) {
        const where = { userId, status: "posted" };
        if (q.startDate || q.endDate) {
            where.date = {};
            if (q.startDate)
                where.date.gte = new Date(q.startDate);
            if (q.endDate)
                where.date.lte = new Date(q.endDate);
        }
        if (q.accountId)
            where.accountId = q.accountId;
        if (q.categoryId)
            where.categoryId = q.categoryId;
        if (q.type)
            where.type = q.type;
        return where;
    }
    async summary(userId, q) {
        const where = this.baseWhere(userId, q);
        const start = q.startDate ? new Date(q.startDate) : null;
        const end = q.endDate ? new Date(q.endDate) : null;
        let prevStart = null, prevEnd = null;
        if (start && end) {
            const diff = end.getTime() - start.getTime();
            prevEnd = new Date(start.getTime() - 1);
            prevStart = new Date(prevEnd.getTime() - diff);
        }
        const txs = await this.prisma.transaction.findMany({ where, select: { type: true, kind: true, amountCents: true } });
        const prevTxs = prevStart && prevEnd ? await this.prisma.transaction.findMany({ where: { ...where, date: { gte: prevStart, lte: prevEnd } }, select: { type: true, kind: true, amountCents: true } }) : [];
        let income = 0, expense = 0, count = 0;
        for (const t of txs) {
            if (t.kind === "invoice_payment" || t.kind === "bill_payment" || t.kind === "adjustment")
                continue;
            count++;
            if (t.type === "income")
                income += t.amountCents;
            else
                expense += t.amountCents;
        }
        let prevIncome = 0, prevExpense = 0;
        for (const t of prevTxs) {
            if (t.kind === "invoice_payment" || t.kind === "bill_payment" || t.kind === "adjustment")
                continue;
            if (t.type === "income")
                prevIncome += t.amountCents;
            else
                prevExpense += t.amountCents;
        }
        const pct = (cur, prev) => (prev > 0 ? Math.round(((cur - prev) / prev) * 10000) / 100 : 0);
        return {
            incomeCents: income,
            expenseCents: expense,
            netCents: income - expense,
            count,
            previous: { incomeCents: prevIncome, expenseCents: prevExpense, netCents: prevIncome - prevExpense },
            changePercent: { income: pct(income, prevIncome), expense: pct(expense, prevExpense), net: pct(income - expense, prevIncome - prevExpense) },
        };
    }
    async categories(userId, q) {
        const where = this.baseWhere(userId, q);
        const txs = await this.prisma.transaction.findMany({ where, select: { categoryId: true, amountCents: true, type: true, kind: true, category: { select: { label: true, icon: true, color: true, type: true } } } });
        const map = new Map();
        let totalIncome = 0, totalExpense = 0;
        for (const t of txs) {
            if (t.kind === "invoice_payment" || t.kind === "bill_payment" || t.kind === "adjustment")
                continue;
            const cur = map.get(t.categoryId) || { categoryId: t.categoryId, name: t.category?.label, icon: t.category?.icon, color: t.category?.color, type: t.category?.type, totalCents: 0, count: 0 };
            cur.totalCents += t.amountCents;
            cur.count += 1;
            map.set(t.categoryId, cur);
            if (t.type === "income")
                totalIncome += t.amountCents;
            else
                totalExpense += t.amountCents;
        }
        const items = Array.from(map.values()).map((i) => ({
            ...i,
            percentage: i.type === "income"
                ? (totalIncome > 0 ? Math.round((i.totalCents / totalIncome) * 10000) / 100 : 0)
                : (totalExpense > 0 ? Math.round((i.totalCents / totalExpense) * 10000) / 100 : 0),
        }));
        return { totalIncomeCents: totalIncome, totalExpenseCents: totalExpense, items };
    }
    async evolution(userId, q) {
        const groupBy = q.groupBy || "month";
        const start = q.startDate ? new Date(q.startDate) : new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1);
        const end = q.endDate ? new Date(q.endDate) : new Date();
        const results = [];
        if (groupBy === "month") {
            let cur = new Date(start.getFullYear(), start.getMonth(), 1);
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
        else if (groupBy === "week") {
            let cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const day = cur.getDay();
            const diff = (day === 0 ? -6 : 1 - day);
            cur.setDate(cur.getDate() + diff);
            while (cur <= end) {
                const from = new Date(cur);
                const to = new Date(cur);
                to.setDate(to.getDate() + 6);
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
                const tmp = new Date(cur.getTime());
                tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
                const week1 = new Date(tmp.getFullYear(), 0, 4);
                const weekNo = 1 + Math.round(((tmp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
                results.push({ period: `${tmp.getFullYear()}-W${String(weekNo).padStart(2, "0")}`, incomeCents: income, expenseCents: expense, netCents: income - expense });
                cur.setDate(cur.getDate() + 7);
            }
        }
        else if (groupBy === "year") {
            let cur = start.getFullYear();
            const endY = end.getFullYear();
            while (cur <= endY) {
                const from = new Date(cur, 0, 1);
                const to = new Date(cur, 11, 31);
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
                results.push({ period: `${cur}`, incomeCents: income, expenseCents: expense, netCents: income - expense });
                cur++;
            }
        }
        else {
            let cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            while (cur <= end) {
                const txs = await this.prisma.transaction.findMany({ where: { userId, status: "posted", date: cur }, select: { type: true, kind: true, amountCents: true } });
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
    async accounts(userId, q) {
        const accounts = await this.prisma.account.findMany({ where: { userId } });
        const results = [];
        for (const a of accounts) {
            const where = { userId, accountId: a.id, status: "posted" };
            if (q.startDate || q.endDate) {
                where.date = {};
                if (q.startDate)
                    where.date.gte = new Date(q.startDate);
                if (q.endDate)
                    where.date.lte = new Date(q.endDate);
            }
            const txs = await this.prisma.transaction.findMany({ where, select: { type: true, kind: true, amountCents: true } });
            let income = 0, expense = 0;
            for (const t of txs) {
                if (t.kind === "invoice_payment" || t.kind === "bill_payment" || t.kind === "adjustment")
                    continue;
                if (t.type === "income")
                    income += t.amountCents;
                else
                    expense += t.amountCents;
            }
            const bal = await this.balance.calculateAccountBalance(a.id, userId);
            results.push({ accountId: a.id, name: a.name, institution: a.institution, type: a.type, isActive: a.isActive, initialBalanceCents: a.initialBalanceCents, currentBalanceCents: bal.balanceCents, incomeCents: income, expenseCents: expense });
        }
        return results;
    }
    async creditCards(userId, q) {
        const cards = await this.prisma.creditCard.findMany({ where: { userId } });
        const results = [];
        for (const c of cards) {
            const txWhere = { userId, creditCardId: c.id, status: "posted" };
            if (q.startDate || q.endDate) {
                txWhere.date = {};
                if (q.startDate)
                    txWhere.date.gte = new Date(q.startDate);
                if (q.endDate)
                    txWhere.date.lte = new Date(q.endDate);
            }
            const purchases = await this.prisma.transaction.findMany({ where: txWhere, select: { amountCents: true, categoryId: true, category: { select: { label: true } } } });
            const byCategory = new Map();
            let totalPurchases = 0;
            for (const p of purchases) {
                totalPurchases += p.amountCents;
                const key = p.categoryId;
                byCategory.set(key, (byCategory.get(key) ?? 0) + p.amountCents);
            }
            const invoices = await this.prisma.creditCardInvoice.findMany({ where: { creditCardId: c.id, userId } });
            let pendingInvoices = 0;
            for (const inv of invoices) {
                if (inv.status === "paid")
                    continue;
                const agg = await this.prisma.transaction.aggregate({ where: { invoiceId: inv.id }, _sum: { amountCents: true } });
                pendingInvoices += agg._sum.amountCents ?? 0;
            }
            const paidAgg = await this.prisma.transaction.aggregate({ where: { userId, creditCardId: c.id, kind: "invoice_payment", status: "posted" }, _sum: { amountCents: true } });
            results.push({
                creditCardId: c.id,
                name: c.name,
                brand: c.brand,
                lastFourDigits: c.lastFourDigits,
                creditLimitCents: c.creditLimitCents,
                totalPurchasesCents: totalPurchases,
                purchasesByCategory: Array.from(byCategory.entries()).map(([categoryId, total]) => ({ categoryId, totalCents: total })),
                pendingInvoicesCents: pendingInvoices,
                paidInvoicesCents: paidAgg._sum.amountCents ?? 0,
                nextClosing: c.closingDay,
                nextDue: c.dueDay,
            });
        }
        return results;
    }
    async commitments(userId) {
        const pendingInstallments = await this.prisma.installment.findMany({ where: { userId, status: "pending" } });
        const pendingBills = await this.prisma.bill.findMany({ where: { userId, status: "pending" } });
        const recurrences = await this.prisma.recurrence.findMany({ where: { userId, isActive: true } });
        const total = pendingInstallments.reduce((s, i) => s + i.amountCents, 0) + pendingBills.reduce((s, b) => s + b.amountCents, 0) + recurrences.reduce((s, r) => s + r.amountCents, 0);
        return {
            pendingInstallmentsCents: pendingInstallments.reduce((s, i) => s + i.amountCents, 0),
            pendingBillsCents: pendingBills.reduce((s, b) => s + b.amountCents, 0),
            recurrencesCents: recurrences.reduce((s, r) => s + r.amountCents, 0),
            totalCommitmentsCents: total,
            nextDueDates: [...pendingInstallments.map((i) => i.dueDate), ...pendingBills.map((b) => b.dueDate)].sort((a, b) => a.getTime() - b.getTime()).slice(0, 10),
        };
    }
};
ReportsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService, BalanceService])
], ReportsService);
export { ReportsService };
//# sourceMappingURL=reports.service.js.map