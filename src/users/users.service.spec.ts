import { describe, it, expect, beforeEach, vi } from "vitest";
import { UsersService } from "./users.service.js";
import { PrismaService } from "../prisma/prisma.service.js";

describe("UsersService", () => {
  let service: UsersService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      user: { findUnique: vi.fn() },
      profile: { findUnique: vi.fn(), update: vi.fn() },
    };
    service = new UsersService(prisma as PrismaService);
  });

  it("returns user without passwordHash", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "u1", email: "a@b.com", passwordHash: "secret", profile: {} });
    const res: any = await service.getMe("u1");
    expect(res.passwordHash).toBeUndefined();
    expect(res.email).toBe("a@b.com");
  });

  it("throws when user not found", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.getMe("u1")).rejects.toThrow();
  });

  it("updates profile displayName", async () => {
    prisma.profile.findUnique.mockResolvedValue({ id: "u1" });
    prisma.profile.update.mockResolvedValue({ id: "u1", displayName: "New" });
    const res = await service.updateProfile("u1", { displayName: "New" });
    expect(res.displayName).toBe("New");
  });

  it("updates preferences", async () => {
    prisma.profile.findUnique.mockResolvedValue({ id: "u1" });
    prisma.profile.update.mockResolvedValue({ id: "u1", theme: "dark", onboardingCompleted: true });
    const res: any = await service.updatePreferences("u1", { theme: "dark", onboardingCompleted: true });
    expect(res.theme).toBe("dark");
  });

  it("throws when updating nonexistent profile", async () => {
    prisma.profile.findUnique.mockResolvedValue(null);
    await expect(service.updatePreferences("u1", { theme: "dark" })).rejects.toThrow();
  });

  it("returns onboarding status", async () => {
    prisma.profile.findUnique.mockResolvedValue({ onboardingCompleted: false });
    const res = await service.getOnboarding("u1");
    expect(res).toEqual({ onboardingCompleted: false });
  });
});