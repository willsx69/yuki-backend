import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthService } from "./auth.service.js";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service.js";

vi.mock("argon2", () => ({
  hash: vi.fn(async (p: string) => `hashed:${p}`),
  verify: vi.fn(async (_hash: string, p: string) => _hash === `hashed:${p}`),
}));

describe("AuthService", () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;
  let config: any;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
    };
    jwt = {
      sign: vi.fn(() => "access-token"),
    };
    config = {
      get: vi.fn((key: string) => {
        if (key === "JWT_SECRET") return "secret";
        if (key === "JWT_REFRESH_SECRET") return "refresh-secret";
        return undefined;
      }),
    };
    service = new AuthService(prisma as PrismaService, jwt as JwtService, config as ConfigService);
  });

  it("registers a new user", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: "u1", email: "a@b.com", profile: {} });
    const res = await service.register("Name", "a@b.com", "password1");
    expect(res).toEqual({ accessToken: "access-token", user: { id: "u1", email: "a@b.com" } });
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it("throws ConflictException on duplicate email", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "u1", email: "a@b.com" });
    await expect(service.register("Name", "a@b.com", "password1")).rejects.toThrow();
  });

  it("logs in with correct credentials", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "u1", email: "a@b.com", passwordHash: "hashed:password1" });
    const res = await service.login("a@b.com", "password1");
    expect(res.accessToken).toBe("access-token");
  });

  it("throws on wrong password", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "u1", email: "a@b.com", passwordHash: "hashed:password1" });
    await expect(service.login("a@b.com", "wrong")).rejects.toThrow();
  });

  it("throws on unknown email without revealing existence", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.login("nope@b.com", "password1")).rejects.toThrow();
  });
});