import { PrismaService } from "../prisma/prisma.service.js";
import { BalanceService } from "../accounts/balance.service.js";
export declare class ReportsService {
    private prisma;
    private balance;
    constructor(prisma: PrismaService, balance: BalanceService);
    private baseWhere;
    summary(userId: string, q: any): Promise<{
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
    categories(userId: string, q: any): Promise<{
        totalIncomeCents: number;
        totalExpenseCents: number;
        items: any[];
    }>;
    evolution(userId: string, q: any): Promise<any[]>;
    accounts(userId: string, q: any): Promise<{
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
    creditCards(userId: string, q: any): Promise<{
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
    commitments(userId: string): Promise<{
        pendingInstallmentsCents: number;
        pendingBillsCents: number;
        recurrencesCents: number;
        totalCommitmentsCents: number;
        nextDueDates: Date[];
    }>;
}
