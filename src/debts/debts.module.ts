import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { DebtsController, InstallmentsController } from "./debts.controller.js";
import { DebtsService } from "./debts.service.js";

@Module({
  imports: [AuthModule],
  controllers: [DebtsController, InstallmentsController],
  providers: [DebtsService],
  exports: [DebtsService],
})
export class DebtsModule {}