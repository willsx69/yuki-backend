import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { AccountsModule } from "../accounts/accounts.module.js";
import { CreditCardsModule } from "../credit-cards/credit-cards.module.js";
import { TransactionsController } from "./transactions.controller.js";
import { TransactionsService } from "./transactions.service.js";

@Module({
  imports: [AuthModule, AccountsModule, CreditCardsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}