import { describe, it, expect, beforeEach, vi } from "vitest";
import { InsightsService } from "./insights.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { ReportsService } from "../reports/reports.service.js";

describe("InsightsService", () => {
  let service: InsightsService;
  let prisma: any;
  let reports: any;

  beforeEach(() => {
    prisma = {
      bill: { findMany: vi.fn() },
      installment: { findMany: vi.fn() },
      debt: { findMany: vi.fn() },
      recurrence: { findMany: vi.fn() },
    };
    reports = { summary: vi.fn(), categories: vi.fn() };
    service = new InsightsService(prisma as PrismaService, reports as ReportsService);
  });

  it("overview returns committed percent", async () => {
    reports.summary
      .mockResolvedValueOnce({ incomeCents: 1000, expenseCents: 400, netCents: 600, changePercent: { income: 0, expense: 0, net: 0 } })
      .mockResolvedValueOnce({ incomeCents: 900, expenseCents: 300, netCents: 600, changePercent: { income: 0, expense: 0, net: 0 } });
    prisma.installment.findMany.mockResolvedValue([]);
    prisma.debt.findMany.mockResolvedValue([]);
    prisma.recurrence.findMany.mockResolvedValue([]);
    const res: any = await service.overview("u1");
    expect(res.committedIncomePercent).toBe(40);
  });

  it("alerts for overdue bill", async () => {
    const past = new Date(Date.now() - 86400000);
    prisma.bill.findMany.mockResolvedValue([{ id: "b1", description: "Rent", dueDate: past, amountCents: 100, status: "pending" }]);
    prisma.installment.findMany.mockResolvedValue([]);
    prisma.debt.findMany.mockResolvedValue([]);
    prisma.recurrence.findMany.mockResolvedValue([]);
    reports.summary.mockResolvedValue({ incomeCents: 1000, expenseCents: 100, netCents: 900, changePercent: { income: 0, expense: 0, net: 0 } });
    const res = await service.alerts("u1");
    expect(res.some((a: any) => a.type === "overdue_bill")).toBe(true);
  });

  it("recommendations explainable", async () => {
    reports.summary.mockResolvedValue({ incomeCents: 1000, expenseCents: 900, netCents: 100, changePercent: { income: 0, expense: 0, net: 0 } });
    reports.categories.mockResolvedValue({ items: [{ categoryId: "c1", name: "Food", totalCents: 500, percentage: 55 }], totalExpenseCents: 900 });
    prisma.installment.findMany.mockResolvedValue([]);
    prisma.debt.findMany.mockResolvedValue([]);
    prisma.recurrence.findMany.mockResolvedValue([]);
    prisma.bill.findMany.mockResolvedValue([]);
    const res = await service.recommendations("u1");
    expect(Array.isArray(res)).toBe(true);
  });

  it("spendingPatterns no division by zero", async () => {
    reports.categories
      .mockResolvedValueOnce({ items: [], totalExpenseCents: 0 })
      .mockResolvedValueOnce({ items: [], totalExpenseCents: 0 });
    const res = await service.spendingPatterns("u1");
    expect(res.increases).toEqual([]);
  });
});