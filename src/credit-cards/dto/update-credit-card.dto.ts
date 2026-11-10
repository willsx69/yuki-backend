import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class UpdateCreditCardDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  brand?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  lastFourDigits?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  creditLimitCents?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  closingDay?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  dueDay?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}