import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { InsightsService } from "./insights.service.js";
import { Throttle } from "@nestjs/throttler";

@Controller("insights")
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 60, ttl: 60000 } })
export class InsightsController {
  constructor(private svc: InsightsService) {}

  @Get("overview")
  overview(@Request() req: any) { return this.svc.overview(req.user.sub); }

  @Get("alerts")
  alerts(@Request() req: any) { return this.svc.alerts(req.user.sub); }

  @Get("recommendations")
  recommendations(@Request() req: any) { return this.svc.recommendations(req.user.sub); }

  @Get("spending-patterns")
  patterns(@Request() req: any) { return this.svc.spendingPatterns(req.user.sub); }
}