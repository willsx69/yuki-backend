var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { PrismaModule } from "./prisma/prisma.module.js";
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { BillsModule } from './bills/bills.module.js';
import { DebtsModule } from './debts/debts.module.js';
import { AccountsModule } from './accounts/accounts.module.js';
import { CreditCardsModule } from './credit-cards/credit-cards.module.js';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { RecurrencesModule } from './recurrences/recurrences.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { InsightsModule } from './insights/insights.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [ConfigModule.forRoot({ isGlobal: true }), ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]), PrismaModule, AuthModule, UsersModule, CategoriesModule, TransactionsModule, BillsModule, DebtsModule, AccountsModule, CreditCardsModule, PaymentMethodsModule, DashboardModule, RecurrencesModule, ReportsModule, InsightsModule],
        controllers: [],
        providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map