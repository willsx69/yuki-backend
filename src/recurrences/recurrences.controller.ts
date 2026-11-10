import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { RecurrencesService } from "./recurrences.service.js";
import { Throttle } from "@nestjs/throttler";

@Controller("recurrences")
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 60, ttl: 60000 } })
export class RecurrencesController {
  constructor(private svc: RecurrencesService) {}

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

  @Post(":id/pause")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  pause(@Request() req: any, @Param("id") id: string) { return this.svc.pause(req.user.sub, id); }

  @Post(":id/resume")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  resume(@Request() req: any, @Param("id") id: string) { return this.svc.resume(req.user.sub, id); }

  @Post(":id/generate")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  generate(@Request() req: any, @Param("id") id: string) { return this.svc.generateNext(req.user.sub, id); }
}