import { PrismaService } from "../prisma/prisma.service.js";
import { CreateAccountDto } from "./dto/create-account.dto.js";
import { UpdateAccountDto } from "./dto/update-account.dto.js";
export declare class AccountsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(userId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import("@prisma/client").$Enums.AccountType;
        color: string | null;
        isActive: boolean;
        userId: string;
        initialBalanceCents: number;
        institution: string | null;
    }[]>;
    get(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import("@prisma/client").$Enums.AccountType;
        color: string | null;
        isActive: boolean;
        userId: string;
        initialBalanceCents: number;
        institution: string | null;
    }>;
    create(userId: string, dto: CreateAccountDto): import("@prisma/client").Prisma.Prisma__AccountClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import("@prisma/client").$Enums.AccountType;
        color: string | null;
        isActive: boolean;
        userId: string;
        initialBalanceCents: number;
        institution: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(userId: string, id: string, dto: UpdateAccountDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import("@prisma/client").$Enums.AccountType;
        color: string | null;
        isActive: boolean;
        userId: string;
        initialBalanceCents: number;
        institution: string | null;
    }>;
    archive(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import("@prisma/client").$Enums.AccountType;
        color: string | null;
        isActive: boolean;
        userId: string;
        initialBalanceCents: number;
        institution: string | null;
    }>;
}
