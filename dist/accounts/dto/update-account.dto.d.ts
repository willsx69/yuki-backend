import { AccountType } from "@prisma/client";
export declare class UpdateAccountDto {
    name?: string;
    type?: AccountType;
    initialBalanceCents?: number;
    institution?: string;
    color?: string;
    isActive?: boolean;
}
