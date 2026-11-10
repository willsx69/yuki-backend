var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { AccountsModule } from "../accounts/accounts.module.js";
import { CreditCardsController, CreditCardInvoicesController } from "./credit-cards.controller.js";
import { CreditCardsService } from "./credit-cards.service.js";
let CreditCardsModule = class CreditCardsModule {
};
CreditCardsModule = __decorate([
    Module({
        imports: [AuthModule, AccountsModule],
        controllers: [CreditCardsController, CreditCardInvoicesController],
        providers: [CreditCardsService],
        exports: [CreditCardsService],
    })
], CreditCardsModule);
export { CreditCardsModule };
//# sourceMappingURL=credit-cards.module.js.map