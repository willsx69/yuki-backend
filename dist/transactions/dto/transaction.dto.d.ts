export declare class CreateTransactionDto {
    type: string;
    amountCents: number;
    description: string;
    categoryId: string;
    date: string;
    accountId: string;
    paymentMethodId: string;
    notes?: string;
}
export declare class UpdateTransactionDto extends CreateTransactionDto {
}
