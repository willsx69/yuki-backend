import { describe, it, expect, beforeEach, vi } from "vitest";
import { RecurrencesService } from "./recurrences.service.js";
import { PrismaService } from "../prisma/prisma.service.js";

describe("RecurrencesService", () => {
  let service: RecurrencesService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      recurrence: { findMany: vi.fn(), findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
      bill: { create: vi.fn() },
    };
    service = new RecurrencesService(prisma as PrismaService);
  });

  it("creates recurrence", async () => {
    prisma.recurrence.create.mockResolvedValue({ id: "r1", name: "Aluguel" });
    const res: any = await service.create("u1", { name: "Aluguel", amountCents: 1000, frequency: "monthly", startDate: "2026-01-01", categoryId: "housing", accountId: "a1" });
    expect(res.name).toBe("Aluguel");
  });

  it("pauses and resumes", async () => {
    prisma.recurrence.findFirst.mockResolvedValue({ id: "r1", userId: "u1" });
    prisma.recurrence.update.mockResolvedValue({ id: "r1", isActive: false });
    const res: any = await service.pause("u1", "r1");
    expect(res.isActive).toBe(false);
  });

  it("blocks access to other user recurrence", async () => {
    prisma.recurrence.findFirst.mockResolvedValue(null);
    await expect(service.get("u1", "r2")).rejects.toThrow();
  });
});