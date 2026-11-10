import { Body, Controller, Get, Patch, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { UsersService } from "./users.service.js";
import { Throttle } from "@nestjs/throttler";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { UpdatePreferencesDto } from "./dto/update-preferences.dto.js";

@Controller("users")
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 60, ttl: 60000 } })
export class UsersController {
  constructor(private users: UsersService) {}

  @Get("me")
  getMe(@Request() req: any) {
    return this.users.getMe(req.user.sub);
  }

  @Patch("me")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  updateMe(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(req.user.sub, dto);
  }

  @Get("me/profile")
  getProfile(@Request() req: any) {
    return this.users.getProfile(req.user.sub);
  }

  @Patch("me/preferences")
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  updatePreferences(@Request() req: any, @Body() dto: UpdatePreferencesDto) {
    return this.users.updatePreferences(req.user.sub, dto);
  }

  @Get("me/onboarding")
  getOnboarding(@Request() req: any) {
    return this.users.getOnboarding(req.user.sub);
  }
}