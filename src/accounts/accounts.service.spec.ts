import { describe, it, expect, beforeEach, vi } from "vitest";
import { AccountsService } from "./accounts.service.js";
import { PrismaService } from "../prisma/prisma.service.js";

describe("AccountsService", () => {
  let service: AccountsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      account: { findMany: vi.fn(), findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
      bill: { count: vi.fn() },
      debt: { count: vi.fn() },
    };
    service = new AccountsService(prisma as PrismaService);
  });

  it("lists accounts", async () => {
    prisma.account.findMany.mockResolvedValue([{ id: "a1" }]);
    const res = await service.list("u1");
    expect(res).toHaveLength(1);
  });

  it("creates account", async () => {
    prisma.account.create.mockResolvedValue({ id: "a1", name: "Nubank" });
    const res: any = await service.create("u1", { name: "Nubank", type: "digital_wallet" as any });
    expect(res.name).toBe("Nubank");
  });

  it("blocks access to other user account", async () => {
    prisma.account.findFirst.mockResolvedValue(null);
    await expect(service.get("u1", "a2")).rejects.toThrow();
  });

  it("archives account", async () => {
    prisma.account.findFirst.mockResolvedValue({ id: "a1", userId: "u1" });
    prisma.bill.count.mockResolvedValue(0);
    prisma.debt.count.mockResolvedValue(0);
    prisma.account.update.mockResolvedValue({ id: "a1", isActive: false });
    const res: any = await service.archive("u1", "a1");
    expect(res.isActive).toBe(false);
  });

  it("blocks archive with pending obligations", async () => {
    prisma.account.findFirst.mockResolvedValue({ id: "a1", userId: "u1" });
    prisma.bill.count.mockResolvedValue(1);
    prisma.debt.count.mockResolvedValue(0);
    await expect(service.archive("u1", "a1")).rejects.toThrow();
  });
});