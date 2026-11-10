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
import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { AccountsService } from "./accounts.service.js";
import { Throttle } from "@nestjs/throttler";
import { BalanceService } from "./balance.service.js";
import { CreateAccountDto } from "./dto/create-account.dto.js";
import { UpdateAccountDto } from "./dto/update-account.dto.js";
let AccountsController = class AccountsController {
    svc;
    balance;
    constructor(svc, balance) {
        this.svc = svc;
        this.balance = balance;
    }
    list(req) { return this.svc.list(req.user.sub); }
    create(req, dto) { return this.svc.create(req.user.sub, dto); }
    get(req, id) { return this.svc.get(req.user.sub, id); }
    update(req, id, dto) { return this.svc.update(req.user.sub, id, dto); }
    archive(req, id) { return this.svc.archive(req.user.sub, id); }
    getBalance(req, id) { return this.balance.calculateAccountBalance(id, req.user.sub); }
};
__decorate([
    Get(),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "list", null);
__decorate([
    Post(),
    Throttle({ default: { limit: 30, ttl: 60000 } }),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateAccountDto]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "create", null);
__decorate([
    Get(":id"),
    __param(0, Request()),
    __param(1, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "get", null);
__decorate([
    Patch(":id"),
    Throttle({ default: { limit: 30, ttl: 60000 } }),
    __param(0, Request()),
    __param(1, Param("id")),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateAccountDto]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "update", null);
__decorate([
    Delete(":id"),
    Throttle({ default: { limit: 30, ttl: 60000 } }),
    __param(0, Request()),
    __param(1, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "archive", null);
__decorate([
    Get(":id/balance"),
    __param(0, Request()),
    __param(1, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "getBalance", null);
AccountsController = __decorate([
    Controller("accounts"),
    UseGuards(JwtAuthGuard),
    Throttle({ default: { limit: 60, ttl: 60000 } }),
    __metadata("design:paramtypes", [AccountsService, BalanceService])
], AccountsController);
export { AccountsController };
//# sourceMappingURL=accounts.controller.js.map