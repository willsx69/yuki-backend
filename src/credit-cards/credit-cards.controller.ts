import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { CreditCardsService } from "./credit-cards.service.js";
import { Throttle } from "@nestjs/throttler";
import { CreateCreditCardDto } from "./dto/create-credit-card.dto.js";
import { UpdateCreditCardDto } from "./dto/update-credit-card.dto.js";
import { PayInvoiceDto } from "./dto/pay-invoice.dto.js";

@Controller("credit-cards")
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 60, ttl: 60000 } })
export class CreditCardsController {
  constructor(private svc: CreditCardsService) {}

  @Get()
  list(@Request() req: any) { return this.svc.list(req.user.sub); }

  @Post()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  create(@Request() req: any, @Body() dto: CreateCreditCardDto) { return this.svc.create(req.user.sub, dto); }

  @Get(":id")
  get(@Request() req: any, @Param("id") id: string) { return this.svc.get(req.user.sub, id); }

  @Patch(":id")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  update(@Request() req: any, @Param("id") id: string, @Body() dto: UpdateCreditCardDto) { return this.svc.update(req.user.sub, id, dto); }

  @Delete(":id")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  archive(@Request() req: any, @Param("id") id: string) { return this.svc.archive(req.user.sub, id); }

  @Get(":id/invoices")
  invoices(@Request() req: any, @Param("id") id: string) { return this.svc.listInvoices(req.user.sub, id); }
}

@Controller("credit-card-invoices")
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 60, ttl: 60000 } })
export class CreditCardInvoicesController {
  constructor(private svc: CreditCardsService) {}

  @Get(":id")
  get(@Request() req: any, @Param("id") id: string) { return this.svc.getInvoice(req.user.sub, id); }

  @Get(":id/transactions")
  transactions(@Request() req: any, @Param("id") id: string) { return this.svc.getInvoiceTransactions(req.user.sub, id); }

  @Post(":id/payments")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  pay(@Request() req: any, @Param("id") id: string, @Body() dto: PayInvoiceDto) { return this.svc.payInvoice(req.user.sub, id, dto); }
}