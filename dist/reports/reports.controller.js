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
import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { ReportsService } from "./reports.service.js";
import { Throttle } from "@nestjs/throttler";
let ReportsController = class ReportsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    summary(req, q) { return this.svc.summary(req.user.sub, q); }
    categories(req, q) { return this.svc.categories(req.user.sub, q); }
    evolution(req, q) { return this.svc.evolution(req.user.sub, q); }
    accounts(req, q) { return this.svc.accounts(req.user.sub, q); }
    creditCards(req, q) { return this.svc.creditCards(req.user.sub, q); }
    commitments(req) { return this.svc.commitments(req.user.sub); }
};
__decorate([
    Get("summary"),
    __param(0, Request()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "summary", null);
__decorate([
    Get("categories"),
    __param(0, Request()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "categories", null);
__decorate([
    Get("evolution"),
    __param(0, Request()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "evolution", null);
__decorate([
    Get("accounts"),
    __param(0, Request()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "accounts", null);
__decorate([
    Get("credit-cards"),
    __param(0, Request()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "creditCards", null);
__decorate([
    Get("commitments"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "commitments", null);
ReportsController = __decorate([
    Controller("reports"),
    UseGuards(JwtAuthGuard),
    Throttle({ default: { limit: 60, ttl: 60000 } }),
    __metadata("design:paramtypes", [ReportsService])
], ReportsController);
export { ReportsController };
//# sourceMappingURL=reports.controller.js.map