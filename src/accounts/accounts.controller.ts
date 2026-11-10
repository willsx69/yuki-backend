import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { AccountsService } from "./accounts.service.js";
import { Throttle } from "@nestjs/throttler";
import { BalanceService } from "./balance.service.js";
import { CreateAccountDto } from "./dto/create-account.dto.js";
import { UpdateAccountDto } from "./dto/update-account.dto.js";

@Controller("accounts")
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 60, ttl: 60000 } })
export class AccountsController {
  constructor(private svc: AccountsService, private balance: BalanceService) {}

  @Get()
  list(@Request() req: any) { return this.svc.list(req.user.sub); }

  @Post()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  create(@Request() req: any, @Body() dto: CreateAccountDto) { return this.svc.create(req.user.sub, dto); }

  @Get(":id")
  get(@Request() req: any, @Param("id") id: string) { return this.svc.get(req.user.sub, id); }

  @Patch(":id")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  update(@Request() req: any, @Param("id") id: string, @Body() dto: UpdateAccountDto) { return this.svc.update(req.user.sub, id, dto); }

  @Delete(":id")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  archive(@Request() req: any, @Param("id") id: string) { return this.svc.archive(req.user.sub, id); }

  @Get(":id/balance")
  getBalance(@Request() req: any, @Param("id") id: string) { return this.balance.calculateAccountBalance(id, req.user.sub); }
}