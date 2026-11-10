import { PrismaService } from "../prisma/prisma.service.js";
import { CreateTransactionDto, UpdateTransactionDto } from "./dto/transaction.dto.js";
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(userId: string): import("@prisma/client").Prisma.PrismaPromise<{
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
    create(userId: string, dto: CreateTransactionDto): import("@prisma/client").Prisma.Prisma__TransactionClient<{
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
    update(userId: string, id: string, dto: UpdateTransactionDto): Promise<{
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
    remove(userId: string, id: string): Promise<void>;
}
