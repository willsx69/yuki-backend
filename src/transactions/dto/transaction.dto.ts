import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateTransactionDto {
  @IsIn(["income", "expense"])
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

  @IsString()
  accountId: string;

  @IsString()
  paymentMethodId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTransactionDto extends CreateTransactionDto {}
