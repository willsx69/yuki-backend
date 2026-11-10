import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { CategoriesService } from "./categories.service.js";
import { Throttle } from "@nestjs/throttler";

@Controller("categories")
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 60, ttl: 60000 } })
export class CategoriesController {
  constructor(private svc: CategoriesService) {}

  @Get()
  list(@Request() req: any, @Query("type") type?: string, @Query("includeInactive") includeInactive?: string) {
    return this.svc.list(req.user.sub, type, includeInactive === "true");
  }

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
  archive(@Request() req: any, @Param("id") id: string) { return this.svc.archive(req.user.sub, id); }
}