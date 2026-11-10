import { AccountsService } from "./accounts.service.js";
import { BalanceService } from "./balance.service.js";
import { CreateAccountDto } from "./dto/create-account.dto.js";
import { UpdateAccountDto } from "./dto/update-account.dto.js";
export declare class AccountsController {
    private svc;
    private balance;
    constructor(svc: AccountsService, balance: BalanceService);
    list(req: any): import("@prisma/client").Prisma.PrismaPromise<{
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
    create(req: any, dto: CreateAccountDto): import("@prisma/client").Prisma.Prisma__AccountClient<{
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
    get(req: any, id: string): Promise<{
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
    update(req: any, id: string, dto: UpdateAccountDto): Promise<{
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
    archive(req: any, id: string): Promise<{
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
    getBalance(req: any, id: string): Promise<{
        accountId: string;
        balanceCents: number;
    }>;
}
