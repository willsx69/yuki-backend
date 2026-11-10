import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { DashboardService } from "./dashboard.service.js";
import { Throttle } from "@nestjs/throttler";

@Controller("dashboard")
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 60, ttl: 60000 } })
export class DashboardController {
  constructor(private svc: DashboardService) {}

  @Get()
  overview(@Request() req: any) { return this.svc.overview(req.user.sub); }

  @Get("evolution")
  evolution(@Request() req: any, @Query() q: any) { return this.svc.evolution(req.user.sub, q); }

  @Get("categories")
  categories(@Request() req: any, @Query() q: any) { return this.svc.categories(req.user.sub, q); }

  @Get("recent-transactions")
  recent(@Request() req: any, @Query("limit") limit?: string) { return this.svc.recentTransactions(req.user.sub, limit ? parseInt(limit, 10) : 10); }

  @Get("upcoming-bills")
  upcomingBills(@Request() req: any) { return this.svc.upcomingBills(req.user.sub); }

  @Get("credit-cards")
  creditCards(@Request() req: any) { return this.svc.creditCards(req.user.sub); }
}