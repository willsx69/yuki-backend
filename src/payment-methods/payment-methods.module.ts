import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { PaymentMethodsController } from "./payment-methods.controller.js";

@Module({
  imports: [AuthModule],
  controllers: [PaymentMethodsController],
})
export class PaymentMethodsModule {}