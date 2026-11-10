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
import { DashboardService } from "./dashboard.service.js";
import { Throttle } from "@nestjs/throttler";
let DashboardController = class DashboardController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    overview(req) { return this.svc.overview(req.user.sub); }
    evolution(req, q) { return this.svc.evolution(req.user.sub, q); }
    categories(req, q) { return this.svc.categories(req.user.sub, q); }
    recent(req, limit) { return this.svc.recentTransactions(req.user.sub, limit ? parseInt(limit, 10) : 10); }
    upcomingBills(req) { return this.svc.upcomingBills(req.user.sub); }
    creditCards(req) { return this.svc.creditCards(req.user.sub); }
};
__decorate([
    Get(),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "overview", null);
__decorate([
    Get("evolution"),
    __param(0, Request()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "evolution", null);
__decorate([
    Get("categories"),
    __param(0, Request()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "categories", null);
__decorate([
    Get("recent-transactions"),
    __param(0, Request()),
    __param(1, Query("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "recent", null);
__decorate([
    Get("upcoming-bills"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "upcomingBills", null);
__decorate([
    Get("credit-cards"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "creditCards", null);
DashboardController = __decorate([
    Controller("dashboard"),
    UseGuards(JwtAuthGuard),
    Throttle({ default: { limit: 60, ttl: 60000 } }),
    __metadata("design:paramtypes", [DashboardService])
], DashboardController);
export { DashboardController };
//# sourceMappingURL=dashboard.controller.js.map