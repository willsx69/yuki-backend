import { ReportsService } from "./reports.service.js";
export declare class ReportsController {
    private svc;
    constructor(svc: ReportsService);
    summary(req: any, q: any): Promise<{
        incomeCents: number;
        expenseCents: number;
        netCents: number;
        count: number;
        previous: {
            incomeCents: number;
            expenseCents: number;
            netCents: number;
        };
        changePercent: {
            income: number;
            expense: number;
            net: number;
        };
    }>;
    categories(req: any, q: any): Promise<{
        totalIncomeCents: number;
        totalExpenseCents: number;
        items: any[];
    }>;
    evolution(req: any, q: any): Promise<any[]>;
    accounts(req: any, q: any): Promise<{
        accountId: string;
        name: string;
        institution: string | null;
        type: import("@prisma/client").$Enums.AccountType;
        isActive: boolean;
        initialBalanceCents: number;
        currentBalanceCents: number;
        incomeCents: number;
        expenseCents: number;
    }[]>;
    creditCards(req: any, q: any): Promise<{
        creditCardId: string;
        name: string;
        brand: string | null;
        lastFourDigits: string | null;
        creditLimitCents: number;
        totalPurchasesCents: number;
        purchasesByCategory: {
            categoryId: string;
            totalCents: number;
        }[];
        pendingInvoicesCents: number;
        paidInvoicesCents: number;
        nextClosing: number;
        nextDue: number;
    }[]>;
    commitments(req: any): Promise<{
        pendingInstallmentsCents: number;
        pendingBillsCents: number;
        recurrencesCents: number;
        totalCommitmentsCents: number;
        nextDueDates: Date[];
    }>;
}
