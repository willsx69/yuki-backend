import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service.js";
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    register(name: string, email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        email: string;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        email: string;
    }>;
    refresh(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        email: string;
    }>;
    private issueTokens;
}
