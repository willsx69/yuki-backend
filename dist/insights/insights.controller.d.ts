import { InsightsService } from "./insights.service.js";
export declare class InsightsController {
    private svc;
    constructor(svc: InsightsService);
    overview(req: any): Promise<{
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
    alerts(req: any): Promise<any[]>;
    recommendations(req: any): Promise<any[]>;
    patterns(req: any): Promise<{
        topCategories: any[];
        increases: any[];
    }>;
}
