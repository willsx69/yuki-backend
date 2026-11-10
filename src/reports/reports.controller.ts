import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { ReportsService } from "./reports.service.js";
import { Throttle } from "@nestjs/throttler";

@Controller("reports")
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 60, ttl: 60000 } })
export class ReportsController {
  constructor(private svc: ReportsService) {}

  @Get("summary")
  summary(@Request() req: any, @Query() q: any) { return this.svc.summary(req.user.sub, q); }

  @Get("categories")
  categories(@Request() req: any, @Query() q: any) { return this.svc.categories(req.user.sub, q); }

  @Get("evolution")
  evolution(@Request() req: any, @Query() q: any) { return this.svc.evolution(req.user.sub, q); }

  @Get("accounts")
  accounts(@Request() req: any, @Query() q: any) { return this.svc.accounts(req.user.sub, q); }

  @Get("credit-cards")
  creditCards(@Request() req: any, @Query() q: any) { return this.svc.creditCards(req.user.sub, q); }

  @Get("commitments")
  commitments(@Request() req: any) { return this.svc.commitments(req.user.sub); }
}