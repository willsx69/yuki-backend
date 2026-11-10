import { TransactionsService } from "./transactions.service.js";
import { CreateTransactionDto, UpdateTransactionDto } from "./dto/transaction.dto.js";
export declare class TransactionsController {
    private svc;
    constructor(svc: TransactionsService);
    list(req: any): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        amountCents: number;
        description: string;
        categoryId: string;
        date: Date;
        accountId: string;
        paymentMethodId: string;
        notes: string | null;
        userId: string;
    }[]>;
    create(req: any, dto: CreateTransactionDto): import("@prisma/client").Prisma.Prisma__TransactionClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        amountCents: number;
        description: string;
        categoryId: string;
        date: Date;
        accountId: string;
        paymentMethodId: string;
        notes: string | null;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(req: any, id: string, dto: UpdateTransactionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        amountCents: number;
        description: string;
        categoryId: string;
        date: Date;
        accountId: string;
        paymentMethodId: string;
        notes: string | null;
        userId: string;
    }>;
    remove(req: any, id: string): Promise<void>;
}
