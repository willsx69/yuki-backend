var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";
export class CreateCreditCardDto {
    name;
    brand;
    lastFourDigits;
    creditLimitCents;
    closingDay;
    dueDay;
}
__decorate([
    IsString(),
    MaxLength(80),
    __metadata("design:type", String)
], CreateCreditCardDto.prototype, "name", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(40),
    __metadata("design:type", String)
], CreateCreditCardDto.prototype, "brand", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(4),
    __metadata("design:type", String)
], CreateCreditCardDto.prototype, "lastFourDigits", void 0);
__decorate([
    IsInt(),
    Min(0),
    __metadata("design:type", Number)
], CreateCreditCardDto.prototype, "creditLimitCents", void 0);
__decorate([
    IsInt(),
    Min(1),
    Max(31),
    __metadata("design:type", Number)
], CreateCreditCardDto.prototype, "closingDay", void 0);
__decorate([
    IsInt(),
    Min(1),
    Max(31),
    __metadata("design:type", Number)
], CreateCreditCardDto.prototype, "dueDay", void 0);
//# sourceMappingURL=create-credit-card.dto.js.map