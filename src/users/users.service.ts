import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException("Usuário não encontrado");
    const { passwordHash: _passwordHash, ...rest } = user as any;
    return rest;
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { id: userId } });
    if (!profile) throw new NotFoundException("Perfil não encontrado");
    return profile;
  }

  async updateProfile(userId: string, dto: { displayName?: string }) {
    const profile = await this.prisma.profile.findUnique({ where: { id: userId } });
    if (!profile) throw new NotFoundException("Perfil não encontrado");
    return this.prisma.profile.update({
      where: { id: userId },
      data: { displayName: dto.displayName },
    });
  }

  async updatePreferences(userId: string, dto: {
    currency?: string;
    language?: string;
    theme?: "light" | "dark" | "system";
    avatarUrl?: string;
    onboardingCompleted?: boolean;
  }) {
    const profile = await this.prisma.profile.findUnique({ where: { id: userId } });
    if (!profile) throw new NotFoundException("Perfil não encontrado");
    return this.prisma.profile.update({
      where: { id: userId },
      data: {
        ...(dto.currency !== undefined && { currency: dto.currency }),
        ...(dto.language !== undefined && { language: dto.language }),
        ...(dto.theme !== undefined && { theme: dto.theme as any }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        ...(dto.onboardingCompleted !== undefined && { onboardingCompleted: dto.onboardingCompleted }),
      },
    });
  }

  async getOnboarding(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { onboardingCompleted: true },
    });
    if (!profile) throw new NotFoundException("Perfil não encontrado");
    return profile;
  }
}