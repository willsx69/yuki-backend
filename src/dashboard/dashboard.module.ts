import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { AccountsModule } from "../accounts/accounts.module.js";
import { DashboardController } from "./dashboard.controller.js";
import { DashboardService } from "./dashboard.service.js";

@Module({
  imports: [AuthModule, AccountsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}