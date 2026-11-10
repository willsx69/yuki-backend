import { describe, it, expect, beforeEach, vi } from "vitest";
import { BalanceService } from "./balance.service.js";
import { PrismaService } from "../prisma/prisma.service.js";

describe("BalanceService", () => {
  let service: BalanceService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      account: { findFirst: vi.fn() },
      transaction: { findMany: vi.fn() },
    };
    service = new BalanceService(prisma as PrismaService);
  });

  it("calculates balance with income and expense", async () => {
    prisma.account.findFirst.mockResolvedValue({ id: "a1", initialBalanceCents: 100000 });
    prisma.transaction.findMany.mockResolvedValue([
      { type: "income", amountCents: 50000, kind: "normal" },
      { type: "expense", amountCents: 30000, kind: "normal" },
    ]);
    const res = await service.calculateAccountBalance("a1", "u1");
    expect(res.balanceCents).toBe(120000);
  });

  it("throws for other user account", async () => {
    prisma.account.findFirst.mockResolvedValue(null);
    await expect(service.calculateAccountBalance("a1", "u2")).rejects.toThrow();
  });
});