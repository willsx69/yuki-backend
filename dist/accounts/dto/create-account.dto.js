var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { AccountType } from "@prisma/client";
export class CreateAccountDto {
    name;
    type;
    initialBalanceCents;
    institution;
    color;
}
__decorate([
    IsString(),
    MaxLength(80),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "name", void 0);
__decorate([
    IsEnum(AccountType),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "type", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(0),
    __metadata("design:type", Number)
], CreateAccountDto.prototype, "initialBalanceCents", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(80),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "institution", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(20),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "color", void 0);
//# sourceMappingURL=create-account.dto.js.map