import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { AccountType } from "@prisma/client";

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @IsOptional()
  @IsInt()
  @Min(0)
  initialBalanceCents?: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  institution?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  color?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}