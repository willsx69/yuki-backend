import { IsBoolean, IsIn, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class UpdatePreferencesDto {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  language?: string;

  @IsOptional()
  @IsIn(["light", "dark", "system"])
  theme?: "light" | "dark" | "system";

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  avatarUrl?: string;

  @IsOptional()
  @IsBoolean()
  onboardingCompleted?: boolean;
}