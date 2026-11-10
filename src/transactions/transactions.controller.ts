import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { TransactionsService } from "./transactions.service.js";
import { CreateTransactionDto, UpdateTransactionDto } from "./dto/transaction.dto.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";

@Controller("transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private svc: TransactionsService) {}

  @Get()
  list(@Req() req: any) {
    return this.svc.list(req.user.sub);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateTransactionDto) {
    return this.svc.create(req.user.sub, dto);
  }

  @Put(":id")
  update(@Req() req: any, @Param("id") id: string, @Body() dto: UpdateTransactionDto) {
    return this.svc.update(req.user.sub, id, dto);
  }

  @Delete(":id")
  remove(@Req() req: any, @Param("id") id: string) {
    return this.svc.remove(req.user.sub, id);
  }
}