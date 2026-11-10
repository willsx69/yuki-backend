import { PrismaService } from "../prisma/prisma.service.js";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getMe(userId: string): Promise<any>;
    getProfile(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        displayName: string;
        avatarUrl: string | null;
        currency: string;
        language: string;
        theme: import("@prisma/client").$Enums.ProfileTheme;
        onboardingCompleted: boolean;
    }>;
    updateProfile(userId: string, dto: {
        displayName?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        displayName: string;
        avatarUrl: string | null;
        currency: string;
        language: string;
        theme: import("@prisma/client").$Enums.ProfileTheme;
        onboardingCompleted: boolean;
    }>;
    updatePreferences(userId: string, dto: {
        currency?: string;
        language?: string;
        theme?: "light" | "dark" | "system";
        avatarUrl?: string;
        onboardingCompleted?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        displayName: string;
        avatarUrl: string | null;
        currency: string;
        language: string;
        theme: import("@prisma/client").$Enums.ProfileTheme;
        onboardingCompleted: boolean;
    }>;
    getOnboarding(userId: string): Promise<{
        onboardingCompleted: boolean;
    }>;
}
