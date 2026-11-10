import { PrismaService } from "../prisma/prisma.service.js";
import { CreateCreditCardDto } from "./dto/create-credit-card.dto.js";
import { UpdateCreditCardDto } from "./dto/update-credit-card.dto.js";
import { PayInvoiceDto } from "./dto/pay-invoice.dto.js";
export declare class CreditCardsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(userId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        userId: string;
        brand: string | null;
        lastFourDigits: string | null;
        creditLimitCents: number;
        closingDay: number;
        dueDay: number;
    }[]>;
    get(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        userId: string;
        brand: string | null;
        lastFourDigits: string | null;
        creditLimitCents: number;
        closingDay: number;
        dueDay: number;
    }>;
    create(userId: string, dto: CreateCreditCardDto): import("@prisma/client").Prisma.Prisma__CreditCardClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        userId: string;
        brand: string | null;
        lastFourDigits: string | null;
        creditLimitCents: number;
        closingDay: number;
        dueDay: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(userId: string, id: string, dto: UpdateCreditCardDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        userId: string;
        brand: string | null;
        lastFourDigits: string | null;
        creditLimitCents: number;
        closingDay: number;
        dueDay: number;
    }>;
    archive(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        userId: string;
        brand: string | null;
        lastFourDigits: string | null;
        creditLimitCents: number;
        closingDay: number;
        dueDay: number;
    }>;
    listInvoices(userId: string, cardId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        creditCardId: string;
        referenceMonth: number;
        referenceYear: number;
        closingDate: Date;
        dueDate: Date;
        paidAt: Date | null;
    }[]>;
    getInvoice(userId: string, invoiceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        creditCardId: string;
        referenceMonth: number;
        referenceYear: number;
        closingDate: Date;
        dueDate: Date;
        paidAt: Date | null;
    }>;
    getInvoiceTransactions(userId: string, invoiceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        userId: string;
        accountId: string | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        kind: import("@prisma/client").$Enums.TransactionKind;
        amountCents: number;
        description: string;
        categoryId: string;
        date: Date;
        paymentMethodId: import("@prisma/client").$Enums.PaymentMethod;
        creditCardId: string | null;
        invoiceId: string | null;
        notes: string | null;
    }[]>;
    invoiceTotal(invoiceId: string): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.GetTransactionAggregateType<{
        where: {
            invoiceId: string;
        };
        _sum: {
            amountCents: true;
        };
    }>>;
    payInvoice(userId: string, invoiceId: string, dto: PayInvoiceDto): Promise<{
        paid: boolean;
        amountCents: number;
    }>;
    resolveInvoice(cardId: string, card: {
        closingDay: number;
        dueDay: number;
    }, purchaseDate: Date): {
        closingDate: Date;
        dueDate: Date;
        referenceMonth: number;
        referenceYear: number;
    };
}
