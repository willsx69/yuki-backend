import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { DebtsService } from "./debts.service.js";
import { Throttle } from "@nestjs/throttler";

@Controller("debts")
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 60, ttl: 60000 } })
export class DebtsController {
  constructor(private svc: DebtsService) {}

  @Get()
  list(@Request() req: any) { return this.svc.list(req.user.sub); }

  @Post()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  create(@Request() req: any, @Body() dto: any) { return this.svc.create(req.user.sub, dto); }

  @Get(":id")
  get(@Request() req: any, @Param("id") id: string) { return this.svc.get(req.user.sub, id); }

  @Patch(":id")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  update(@Request() req: any, @Param("id") id: string, @Body() dto: any) { return this.svc.update(req.user.sub, id, dto); }

  @Delete(":id")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  remove(@Request() req: any, @Param("id") id: string) { return this.svc.remove(req.user.sub, id); }

  @Get(":id/installments")
  installments(@Request() req: any, @Param("id") id: string) { return this.svc.installments(req.user.sub, id); }
}

@Controller("installments")
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 60, ttl: 60000 } })
export class InstallmentsController {
  constructor(private svc: DebtsService) {}

  @Post(":id/payments")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  pay(@Request() req: any, @Param("id") id: string, @Body() dto: any) { return this.svc.payInstallment(req.user.sub, id, dto.accountId); }
}