var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { PaymentMethod } from "@prisma/client";
export class CreateTransactionDto {
    type;
    amountCents;
    description;
    categoryId;
    date;
    accountId;
    paymentMethodId;
    creditCardId;
    notes;
}
__decorate([
    IsEnum(["income", "expense"]),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "type", void 0);
__decorate([
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "amountCents", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "description", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "categoryId", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "date", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "accountId", void 0);
__decorate([
    IsEnum(PaymentMethod),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "paymentMethodId", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "creditCardId", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "notes", void 0);
export class UpdateTransactionDto extends CreateTransactionDto {
}
//# sourceMappingURL=transaction.dto.js.map