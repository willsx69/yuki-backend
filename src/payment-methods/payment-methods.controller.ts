import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { Throttle } from "@nestjs/throttler";
import { PaymentMethod } from "@prisma/client";

@Controller("payment-methods")
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 60, ttl: 60000 } })
export class PaymentMethodsController {
  @Get()
  list() {
    return Object.values(PaymentMethod).map((v) => ({ id: v, label: v }));
  }
}