import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { AccountsModule } from "../accounts/accounts.module.js";
import { ReportsController } from "./reports.controller.js";
import { ReportsService } from "./reports.service.js";

@Module({
  imports: [AuthModule, AccountsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}