var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { PrismaService } from "../prisma/prisma.service.js";
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async register(name, email, password) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing)
            throw new ConflictException("E-mail já cadastrado");
        const passwordHash = await argon2.hash(password);
        const user = await this.prisma.user.create({
            data: {
                email,
                passwordHash,
                profile: { create: { displayName: name } },
            },
            include: { profile: true },
        });
        return this.issueTokens(user.id, user.email);
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new UnauthorizedException("Credenciais inválidas");
        const ok = await argon2.verify(user.passwordHash, password);
        if (!ok)
            throw new UnauthorizedException("Credenciais inválidas");
        return this.issueTokens(user.id, user.email);
    }
    async refresh(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new UnauthorizedException();
        return this.issueTokens(user.id, user.email);
    }
    issueTokens(userId, email) {
        const payload = { sub: userId, email };
        const accessToken = this.jwt.sign(payload, {
            secret: this.config.get("JWT_SECRET"),
            expiresIn: "15m",
        });
        const refreshToken = this.jwt.sign(payload, {
            secret: this.config.get("JWT_REFRESH_SECRET"),
            expiresIn: "7d",
        });
        return { accessToken, refreshToken, userId, email };
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService,
        ConfigService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map