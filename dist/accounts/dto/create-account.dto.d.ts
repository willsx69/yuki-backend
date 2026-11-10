import { AccountType } from "@prisma/client";
export declare class CreateAccountDto {
    name: string;
    type: AccountType;
    initialBalanceCents?: number;
    institution?: string;
    color?: string;
}
