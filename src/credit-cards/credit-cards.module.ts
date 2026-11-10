import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { AccountsModule } from "../accounts/accounts.module.js";
import { CreditCardsController, CreditCardInvoicesController } from "./credit-cards.controller.js";
import { CreditCardsService } from "./credit-cards.service.js";

@Module({
  imports: [AuthModule, AccountsModule],
  controllers: [CreditCardsController, CreditCardInvoicesController],
  providers: [CreditCardsService],
  exports: [CreditCardsService],
})
export class CreditCardsModule {}