var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Patch, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { UsersService } from "./users.service.js";
import { Throttle } from "@nestjs/throttler";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { UpdatePreferencesDto } from "./dto/update-preferences.dto.js";
let UsersController = class UsersController {
    users;
    constructor(users) {
        this.users = users;
    }
    getMe(req) {
        return this.users.getMe(req.user.sub);
    }
    updateMe(req, dto) {
        return this.users.updateProfile(req.user.sub, dto);
    }
    getProfile(req) {
        return this.users.getProfile(req.user.sub);
    }
    updatePreferences(req, dto) {
        return this.users.updatePreferences(req.user.sub, dto);
    }
    getOnboarding(req) {
        return this.users.getOnboarding(req.user.sub);
    }
};
__decorate([
    Get("me"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMe", null);
__decorate([
    Patch("me"),
    Throttle({ default: { limit: 30, ttl: 60000 } }),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMe", null);
__decorate([
    Get("me/profile"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
__decorate([
    Patch("me/preferences"),
    Throttle({ default: { limit: 30, ttl: 60000 } }),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdatePreferencesDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updatePreferences", null);
__decorate([
    Get("me/onboarding"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getOnboarding", null);
UsersController = __decorate([
    Controller("users"),
    UseGuards(JwtAuthGuard),
    Throttle({ default: { limit: 60, ttl: 60000 } }),
    __metadata("design:paramtypes", [UsersService])
], UsersController);
export { UsersController };
//# sourceMappingURL=users.controller.js.map