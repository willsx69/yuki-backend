import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { RecurrencesController } from "./recurrences.controller.js";
import { RecurrencesService } from "./recurrences.service.js";

@Module({
  imports: [AuthModule],
  controllers: [RecurrencesController],
  providers: [RecurrencesService],
})
export class RecurrencesModule {}