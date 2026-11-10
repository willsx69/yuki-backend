import { DashboardService } from "./dashboard.service.js";
export declare class DashboardController {
    private svc;
    constructor(svc: DashboardService);
    overview(req: any): Promise<{
        balance: {
            totalCents: number;
            accountsCount: number;
            accounts: {
                id: string;
                name: string;
                institution: string | null;
                type: import("@prisma/client").$Enums.AccountType;
                color: string | null;
                balanceCents: number;
            }[];
        };
        monthly: {
            incomeCents: number;
            expenseCents: number;
            netCents: number;
            incomeCount: number;
            expenseCount: number;
        };
        comparison: {
            incomeChangePercent: number;
            expenseChangePercent: number;
        };
        recentTransactions: {
            id: string;
            type: import("@prisma/client").$Enums.TransactionType;
            accountId: string | null;
            amountCents: number;
            description: string;
            categoryId: string;
            date: Date;
            paymentMethodId: import("@prisma/client").$Enums.PaymentMethod;
            creditCardId: string | null;
        }[];
        upcomingBills: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.BillType;
            userId: string;
            accountId: string;
            status: import("@prisma/client").$Enums.BillStatus;
            amountCents: number;
            description: string;
            categoryId: string;
            notes: string | null;
            dueDate: Date;
            paidAt: Date | null;
            totalInstallments: number;
            debtId: string | null;
            installmentNumber: number;
            billGroupId: string | null;
            linkedTransactionId: string | null;
        }[];
        creditCards: {
            id: string;
            name: string;
            brand: string | null;
            lastFourDigits: string | null;
            creditLimitCents: number;
            closingDay: number;
            dueDay: number;
        }[];
        debts: {
            activeCount: number;
            remainingCents: number;
            pendingInstallmentsCount: number;
            paidThisMonthCount: number;
            nextDue: {
                number: number;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                status: string;
                amountCents: number;
                dueDate: Date;
                paidAt: Date | null;
                debtId: string;
                transactionId: string | null;
            }[];
        };
        recurrences: {
            activeCount: number;
            monthlyTotalCents: number;
        };
        futureCommitmentsCents: number;
    }>;
    evolution(req: any, q: any): Promise<any[]>;
    categories(req: any, q: any): Promise<any[]>;
    recent(req: any, limit?: string): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.TransactionType;
        accountId: string | null;
        amountCents: number;
        description: string;
        categoryId: string;
        date: Date;
        paymentMethodId: import("@prisma/client").$Enums.PaymentMethod;
        creditCardId: string | null;
    }[]>;
    upcomingBills(req: any): Promise<{
        overdue: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.BillType;
            userId: string;
            accountId: string;
            status: import("@prisma/client").$Enums.BillStatus;
            amountCents: number;
            description: string;
            categoryId: string;
            notes: string | null;
            dueDate: Date;
            paidAt: Date | null;
            totalInstallments: number;
            debtId: string | null;
            installmentNumber: number;
            billGroupId: string | null;
            linkedTransactionId: string | null;
        }[];
        upcoming: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.BillType;
            userId: string;
            accountId: string;
            status: import("@prisma/client").$Enums.BillStatus;
            amountCents: number;
            description: string;
            categoryId: string;
            notes: string | null;
            dueDate: Date;
            paidAt: Date | null;
            totalInstallments: number;
            debtId: string | null;
            installmentNumber: number;
            billGroupId: string | null;
            linkedTransactionId: string | null;
        }[];
        payable: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.BillType;
            userId: string;
            accountId: string;
            status: import("@prisma/client").$Enums.BillStatus;
            amountCents: number;
            description: string;
            categoryId: string;
            notes: string | null;
            dueDate: Date;
            paidAt: Date | null;
            totalInstallments: number;
            debtId: string | null;
            installmentNumber: number;
            billGroupId: string | null;
            linkedTransactionId: string | null;
        }[];
        receivable: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.BillType;
            userId: string;
            accountId: string;
            status: import("@prisma/client").$Enums.BillStatus;
            amountCents: number;
            description: string;
            categoryId: string;
            notes: string | null;
            dueDate: Date;
            paidAt: Date | null;
            totalInstallments: number;
            debtId: string | null;
            installmentNumber: number;
            billGroupId: string | null;
            linkedTransactionId: string | null;
        }[];
    }>;
    creditCards(req: any): Promise<{
        id: string;
        name: string;
        brand: string | null;
        lastFourDigits: string | null;
        creditLimitCents: number;
        usedCents: number;
        availableCents: number;
        closingDay: number;
        dueDay: number;
    }[]>;
}
