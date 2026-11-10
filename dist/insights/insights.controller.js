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
import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { InsightsService } from "./insights.service.js";
import { Throttle } from "@nestjs/throttler";
let InsightsController = class InsightsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    overview(req) { return this.svc.overview(req.user.sub); }
    alerts(req) { return this.svc.alerts(req.user.sub); }
    recommendations(req) { return this.svc.recommendations(req.user.sub); }
    patterns(req) { return this.svc.spendingPatterns(req.user.sub); }
};
__decorate([
    Get("overview"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InsightsController.prototype, "overview", null);
__decorate([
    Get("alerts"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InsightsController.prototype, "alerts", null);
__decorate([
    Get("recommendations"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InsightsController.prototype, "recommendations", null);
__decorate([
    Get("spending-patterns"),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InsightsController.prototype, "patterns", null);
InsightsController = __decorate([
    Controller("insights"),
    UseGuards(JwtAuthGuard),
    Throttle({ default: { limit: 60, ttl: 60000 } }),
    __metadata("design:paramtypes", [InsightsService])
], InsightsController);
export { InsightsController };
//# sourceMappingURL=insights.controller.js.map