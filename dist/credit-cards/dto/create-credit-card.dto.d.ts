export declare class CreateCreditCardDto {
    name: string;
    brand?: string;
    lastFourDigits?: string;
    creditLimitCents: number;
    closingDay: number;
    dueDay: number;
}
