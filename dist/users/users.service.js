var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
        if (!user)
            throw new NotFoundException("Usuário não encontrado");
        const { passwordHash: _passwordHash, ...rest } = user;
        return rest;
    }
    async getProfile(userId) {
        const profile = await this.prisma.profile.findUnique({ where: { id: userId } });
        if (!profile)
            throw new NotFoundException("Perfil não encontrado");
        return profile;
    }
    async updateProfile(userId, dto) {
        const profile = await this.prisma.profile.findUnique({ where: { id: userId } });
        if (!profile)
            throw new NotFoundException("Perfil não encontrado");
        return this.prisma.profile.update({
            where: { id: userId },
            data: { displayName: dto.displayName },
        });
    }
    async updatePreferences(userId, dto) {
        const profile = await this.prisma.profile.findUnique({ where: { id: userId } });
        if (!profile)
            throw new NotFoundException("Perfil não encontrado");
        return this.prisma.profile.update({
            where: { id: userId },
            data: {
                ...(dto.currency !== undefined && { currency: dto.currency }),
                ...(dto.language !== undefined && { language: dto.language }),
                ...(dto.theme !== undefined && { theme: dto.theme }),
                ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
                ...(dto.onboardingCompleted !== undefined && { onboardingCompleted: dto.onboardingCompleted }),
            },
        });
    }
    async getOnboarding(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { id: userId },
            select: { onboardingCompleted: true },
        });
        if (!profile)
            throw new NotFoundException("Perfil não encontrado");
        return profile;
    }
};
UsersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map