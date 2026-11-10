import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { AccountsController } from "./accounts.controller.js";
import { AccountsService } from "./accounts.service.js";
import { BalanceService } from "./balance.service.js";

@Module({
  imports: [AuthModule],
  controllers: [AccountsController],
  providers: [AccountsService, BalanceService],
  exports: [AccountsService, BalanceService],
})
export class AccountsModule {}