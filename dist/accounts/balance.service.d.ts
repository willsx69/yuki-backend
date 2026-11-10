import { PrismaService } from "../prisma/prisma.service.js";
export declare class BalanceService {
    private prisma;
    constructor(prisma: PrismaService);
    calculateAccountBalance(accountId: string, userId: string): Promise<{
        accountId: string;
        balanceCents: number;
    }>;
}
