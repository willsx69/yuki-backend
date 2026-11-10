import { PrismaService } from "../prisma/prisma.service.js";
import { BalanceService } from "../accounts/balance.service.js";
import { AccountsService } from "../accounts/accounts.service.js";
export declare class DashboardService {
    private prisma;
    private balance;
    private accounts;
    constructor(prisma: PrismaService, balance: BalanceService, accounts: AccountsService);
    overview(userId: string): Promise<{
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
    evolution(userId: string, q: any): Promise<any[]>;
    categories(userId: string, q: any): Promise<any[]>;
    recentTransactions(userId: string, limit?: number): Promise<{
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
    upcomingBills(userId: string): Promise<{
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
    creditCards(userId: string): Promise<{
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
