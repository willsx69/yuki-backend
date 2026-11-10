import { PrismaService } from "../prisma/prisma.service.js";
import { ReportsService } from "../reports/reports.service.js";
export declare class InsightsService {
    private prisma;
    private reports;
    constructor(prisma: PrismaService, reports: ReportsService);
    overview(userId: string): Promise<{
        month: {
            incomeCents: number;
            expenseCents: number;
            netCents: number;
        };
        previousMonth: {
            incomeCents: number;
            expenseCents: number;
            netCents: number;
        };
        changes: {
            income: number;
            expense: number;
            net: number;
        };
        committedIncomePercent: number;
        debts: {
            activeCount: number;
            remainingCents: number;
        };
        recurrences: {
            activeCount: number;
            monthlyCents: number;
        };
        futureCommitmentsCents: number;
    }>;
    alerts(userId: string): Promise<any[]>;
    recommendations(userId: string): Promise<any[]>;
    spendingPatterns(userId: string): Promise<{
        topCategories: any[];
        increases: any[];
    }>;
}
