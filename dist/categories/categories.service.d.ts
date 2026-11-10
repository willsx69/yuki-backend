import { PrismaService } from "../prisma/prisma.service.js";
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    list(userId: string, type?: string, includeInactive?: boolean): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        type: import("@prisma/client").$Enums.TransactionType;
        icon: string | null;
        color: string | null;
        isActive: boolean;
        isCustom: boolean;
        userId: string | null;
    }[]>;
    get(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        type: import("@prisma/client").$Enums.TransactionType;
        icon: string | null;
        color: string | null;
        isActive: boolean;
        isCustom: boolean;
        userId: string | null;
    }>;
    create(userId: string, dto: {
        label: string;
        type: "income" | "expense";
        icon?: string;
        color?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        type: import("@prisma/client").$Enums.TransactionType;
        icon: string | null;
        color: string | null;
        isActive: boolean;
        isCustom: boolean;
        userId: string | null;
    }>;
    update(userId: string, id: string, dto: {
        label?: string;
        icon?: string;
        color?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        type: import("@prisma/client").$Enums.TransactionType;
        icon: string | null;
        color: string | null;
        isActive: boolean;
        isCustom: boolean;
        userId: string | null;
    }>;
    archive(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        type: import("@prisma/client").$Enums.TransactionType;
        icon: string | null;
        color: string | null;
        isActive: boolean;
        isCustom: boolean;
        userId: string | null;
    }>;
}
