import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { PaymentMethod } from "@prisma/client";

export class CreateTransactionDto {
  @IsEnum(["income", "expense"])
  type: string;

  @IsInt()
  @Min(1)
  amountCents: number;

  @IsString()
  description: string;

  @IsString()
  categoryId: string;

  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  accountId?: string;

  @IsEnum(PaymentMethod)
  paymentMethodId: PaymentMethod;

  @IsOptional()
  @IsString()
  creditCardId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTransactionDto extends CreateTransactionDto {}