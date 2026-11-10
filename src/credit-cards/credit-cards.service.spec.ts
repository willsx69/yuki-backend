import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreditCardsService } from "./credit-cards.service.js";
import { PrismaService } from "../prisma/prisma.service.js";

describe("CreditCardsService", () => {
  let service: CreditCardsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      creditCard: { findMany: vi.fn(), findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
      creditCardInvoice: { findMany: vi.fn(), findFirst: vi.fn(), findUnique: vi.fn(), create: vi.fn(), updateMany: vi.fn() },
      transaction: { findMany: vi.fn(), create: vi.fn(), aggregate: vi.fn() },
      account: { findFirst: vi.fn() },
      category: { findFirst: vi.fn() },
    };
    service = new CreditCardsService(prisma as PrismaService);
  });

  it("creates card", async () => {
    prisma.creditCard.create.mockResolvedValue({ id: "c1", name: "Visa" });
    const res: any = await service.create("u1", { name: "Visa", creditLimitCents: 100000, closingDay: 10, dueDay: 20 } as any);
    expect(res.name).toBe("Visa");
  });

  it("blocks access to other user card", async () => {
    prisma.creditCard.findFirst.mockResolvedValue(null);
    await expect(service.get("u1", "c2")).rejects.toThrow();
  });

  it("archives card", async () => {
    prisma.creditCard.findFirst.mockResolvedValue({ id: "c1", userId: "u1" });
    prisma.creditCard.update.mockResolvedValue({ id: "c1", isActive: false });
    const res: any = await service.archive("u1", "c1");
    expect(res.isActive).toBe(false);
  });

  it("prevents duplicate invoice payment", async () => {
    prisma.creditCardInvoice.findFirst.mockResolvedValue({ id: "i1", userId: "u1", status: "paid" });
    await expect(service.payInvoice("u1", "i1", { accountId: "a1" } as any)).rejects.toThrow();
  });
});