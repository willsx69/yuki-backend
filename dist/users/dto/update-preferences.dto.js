var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsBoolean, IsIn, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";
export class UpdatePreferencesDto {
    currency;
    language;
    theme;
    avatarUrl;
    onboardingCompleted;
}
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(10),
    __metadata("design:type", String)
], UpdatePreferencesDto.prototype, "currency", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(10),
    __metadata("design:type", String)
], UpdatePreferencesDto.prototype, "language", void 0);
__decorate([
    IsOptional(),
    IsIn(["light", "dark", "system"]),
    __metadata("design:type", String)
], UpdatePreferencesDto.prototype, "theme", void 0);
__decorate([
    IsOptional(),
    IsUrl({ require_tld: false }),
    MaxLength(2048),
    __metadata("design:type", String)
], UpdatePreferencesDto.prototype, "avatarUrl", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdatePreferencesDto.prototype, "onboardingCompleted", void 0);
//# sourceMappingURL=update-preferences.dto.js.map