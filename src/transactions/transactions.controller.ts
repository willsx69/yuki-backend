import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { TransactionsService } from "./transactions.service.js";
import { CreateTransactionDto, UpdateTransactionDto } from "./dto/transaction.dto.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { Throttle } from "@nestjs/throttler";

@Controller("transactions")
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 60, ttl: 60000 } })
export class TransactionsController {
  constructor(private svc: TransactionsService) {}

  @Get()
  list(@Req() req: any, @Query() q: any) { return this.svc.list(req.user.sub, q); }

  @Get("summary")
  summary(@Req() req: any, @Query() q: any) { return this.svc.summary(req.user.sub, q); }

  @Get("statistics")
  statistics(@Req() req: any, @Query() q: any) { return this.svc.statistics(req.user.sub, q); }

  @Get("statistics/categories")
  statisticsCategories(@Req() req: any, @Query() q: any) { return this.svc.statisticsByCategory(req.user.sub, q); }

  @Get("statistics/monthly")
  statisticsMonthly(@Req() req: any, @Query() q: any) { return this.svc.statisticsMonthly(req.user.sub, q); }

  @Post()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  create(@Req() req: any, @Body() dto: CreateTransactionDto) { return this.svc.create(req.user.sub, dto); }

  @Get(":id")
  get(@Req() req: any, @Param("id") id: string) { return this.svc.get(req.user.sub, id); }

  @Put(":id")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  update(@Req() req: any, @Param("id") id: string, @Body() dto: UpdateTransactionDto) { return this.svc.update(req.user.sub, id, dto); }

  @Delete(":id")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  remove(@Req() req: any, @Param("id") id: string) { return this.svc.remove(req.user.sub, id); }

  @Patch(":id/cancel")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  cancel(@Req() req: any, @Param("id") id: string) { return this.svc.cancel(req.user.sub, id); }

  @Post(":id/reverse")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  reverse(@Req() req: any, @Param("id") id: string) { return this.svc.reverse(req.user.sub, id); }
}