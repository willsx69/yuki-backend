import { PaymentMethod } from "@prisma/client";
export declare class CreateTransactionDto {
    type: string;
    amountCents: number;
    description: string;
    categoryId: string;
    date: string;
    accountId?: string;
    paymentMethodId: PaymentMethod;
    creditCardId?: string;
    notes?: string;
}
export declare class UpdateTransactionDto extends CreateTransactionDto {
}
