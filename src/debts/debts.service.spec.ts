import { describe, it, expect, beforeEach, vi } from "vitest";
import { DebtsService } from "./debts.service.js";
import { PrismaService } from "../prisma/prisma.service.js";

describe("DebtsService", () => {
  let service: DebtsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      debt: { findMany: vi.fn(), findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
      installment: { createMany: vi.fn(), findMany: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn(), count: vi.fn() },
      account: { findFirst: vi.fn() },
      category: { findFirst: vi.fn() },
      transaction: { create: vi.fn() },
    };
    service = new DebtsService(prisma as PrismaService);
  });

  it("creates debt and generates installments", async () => {
    prisma.debt.create.mockResolvedValue({ id: "d1" });
    prisma.installment.createMany.mockResolvedValue({ count: 2 });
    const res: any = await service.create("u1", { name: "Notebook", creditor: "Store", installmentCents: 100, totalInstallments: 2, firstPendingDueDate: "2026-01-01", categoryId: "shopping", accountId: "a1" });
    expect(res.id).toBe("d1");
    expect(prisma.installment.createMany).toHaveBeenCalled();
  });

  it("blocks access to other user debt", async () => {
    prisma.debt.findFirst.mockResolvedValue(null);
    await expect(service.get("u1", "d2")).rejects.toThrow();
  });

  it("prevents duplicate installment payment", async () => {
    prisma.installment.findFirst.mockResolvedValue({ id: "i1", userId: "u1", status: "paid" });
    await expect(service.payInstallment("u1", "i1", "a1")).rejects.toThrow();
  });
});