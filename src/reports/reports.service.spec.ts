import { describe, it, expect, beforeEach, vi } from "vitest";
import { ReportsService } from "./reports.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { BalanceService } from "../accounts/balance.service.js";

describe("ReportsService", () => {
  let service: ReportsService;
  let prisma: any;
  let balance: any;

  beforeEach(() => {
    prisma = {
      transaction: { findMany: vi.fn(), count: vi.fn() },
      account: { findMany: vi.fn() },
      creditCard: { findMany: vi.fn() },
      creditCardInvoice: { findMany: vi.fn() },
      installment: { findMany: vi.fn() },
      bill: { findMany: vi.fn() },
      recurrence: { findMany: vi.fn() },
    };
    balance = { calculateAccountBalance: vi.fn(async () => ({ balanceCents: 1000 })) };
    service = new ReportsService(prisma as PrismaService, balance as BalanceService);
  });

  it("summary calculates income/expense/net", async () => {
    prisma.transaction.findMany
      .mockResolvedValueOnce([
        { type: "income", kind: "normal", amountCents: 1000 },
        { type: "expense", kind: "normal", amountCents: 300 },
      ])
      .mockResolvedValueOnce([]);
    const res: any = await service.summary("u1", { startDate: "2026-01-01", endDate: "2026-01-31" });
    expect(res.incomeCents).toBe(1000);
    expect(res.expenseCents).toBe(300);
    expect(res.netCents).toBe(700);
  });

  it("excludes pending/cancelled by status filter (mocked)", async () => {
    prisma.transaction.findMany.mockResolvedValue([]);
    const res: any = await service.summary("u1", { startDate: "2026-01-01", endDate: "2026-01-31" });
    expect(res.count).toBe(0);
  });

  it("categories groups and percentages", async () => {
    prisma.transaction.findMany.mockResolvedValue([
      { categoryId: "c1", amountCents: 200, type: "expense", kind: "normal", category: { label: "Food", icon: null, color: null, type: "expense" } },
      { categoryId: "c2", amountCents: 100, type: "expense", kind: "normal", category: { label: "Transport", icon: null, color: null, type: "expense" } },
    ]);
    const res: any = await service.categories("u1", { startDate: "2026-01-01", endDate: "2026-01-31" });
    expect(res.totalExpenseCents).toBe(300);
    expect(res.items).toHaveLength(2);
  });

  it("evolution monthly returns periods", async () => {
    prisma.transaction.findMany.mockResolvedValue([]);
    const res = await service.evolution("u1", { startDate: "2026-01-01", endDate: "2026-02-28", groupBy: "month" });
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThanOrEqual(2);
  });

  it("evolution weekly returns periods", async () => {
    prisma.transaction.findMany.mockResolvedValue([]);
    const res = await service.evolution("u1", { startDate: "2026-01-05", endDate: "2026-01-19", groupBy: "week" });
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThan(0);
  });

  it("commitments sums future obligations", async () => {
    prisma.installment.findMany.mockResolvedValue([{ amountCents: 100 }]);
    prisma.bill.findMany.mockResolvedValue([{ amountCents: 200 }]);
    prisma.recurrence.findMany.mockResolvedValue([{ amountCents: 50 }]);
    const res: any = await service.commitments("u1");
    expect(res.totalCommitmentsCents).toBe(350);
  });
});