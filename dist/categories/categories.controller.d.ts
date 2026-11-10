import { CategoriesService } from "./categories.service.js";
export declare class CategoriesController {
    private svc;
    constructor(svc: CategoriesService);
    list(req: any, type?: string, includeInactive?: string): import("@prisma/client").Prisma.PrismaPromise<{
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
    create(req: any, dto: any): Promise<{
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
    get(req: any, id: string): Promise<{
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
    update(req: any, id: string, dto: any): Promise<{
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
    archive(req: any, id: string): Promise<{
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
