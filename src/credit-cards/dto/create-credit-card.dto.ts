import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateCreditCardDto {
  @IsString()
  @MaxLength(80)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  brand?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  lastFourDigits?: string;

  @IsInt()
  @Min(0)
  creditLimitCents: number;

  @IsInt()
  @Min(1)
  @Max(31)
  closingDay: number;

  @IsInt()
  @Min(1)
  @Max(31)
  dueDay: number;
}