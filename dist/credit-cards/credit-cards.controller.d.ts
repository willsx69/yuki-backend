import { CreditCardsService } from "./credit-cards.service.js";
import { CreateCreditCardDto } from "./dto/create-credit-card.dto.js";
import { UpdateCreditCardDto } from "./dto/update-credit-card.dto.js";
import { PayInvoiceDto } from "./dto/pay-invoice.dto.js";
export declare class CreditCardsController {
    private svc;
    constructor(svc: CreditCardsService);
    list(req: any): import("@prisma/client").Prisma.PrismaPromise<{
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
    create(req: any, dto: CreateCreditCardDto): import("@prisma/client").Prisma.Prisma__CreditCardClient<{
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
    get(req: any, id: string): Promise<{
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
    update(req: any, id: string, dto: UpdateCreditCardDto): Promise<{
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
    archive(req: any, id: string): Promise<{
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
    invoices(req: any, id: string): Promise<{
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
}
export declare class CreditCardInvoicesController {
    private svc;
    constructor(svc: CreditCardsService);
    get(req: any, id: string): Promise<{
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
    transactions(req: any, id: string): Promise<{
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
    pay(req: any, id: string, dto: PayInvoiceDto): Promise<{
        paid: boolean;
        amountCents: number;
    }>;
}
