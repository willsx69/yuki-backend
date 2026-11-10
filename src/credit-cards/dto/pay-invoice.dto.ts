import { IsString } from "class-validator";

export class PayInvoiceDto {
  @IsString()
  accountId: string;
}