import { UsersService } from "./users.service.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { UpdatePreferencesDto } from "./dto/update-preferences.dto.js";
export declare class UsersController {
    private users;
    constructor(users: UsersService);
    getMe(req: any): Promise<any>;
    updateMe(req: any, dto: UpdateProfileDto): Promise<{
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
    getProfile(req: any): Promise<{
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
    updatePreferences(req: any, dto: UpdatePreferencesDto): Promise<{
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
    getOnboarding(req: any): Promise<{
        onboardingCompleted: boolean;
    }>;
}
