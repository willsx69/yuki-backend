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
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { TransactionsService } from "./transactions.service.js";
import { CreateTransactionDto, UpdateTransactionDto } from "./dto/transaction.dto.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { Throttle } from "@nestjs/throttler";
let TransactionsController = class TransactionsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    list(req, q) { return this.svc.list(req.user.sub, q); }
    summary(req, q) { return this.svc.summary(req.user.sub, q); }
    statistics(req, q) { return this.svc.statistics(req.user.sub, q); }
    statisticsCategories(req, q) { return this.svc.statisticsByCategory(req.user.sub, q); }
    statisticsMonthly(req, q) { return this.svc.statisticsMonthly(req.user.sub, q); }
    create(req, dto) { return this.svc.create(req.user.sub, dto); }
    get(req, id) { return this.svc.get(req.user.sub, id); }
    update(req, id, dto) { return this.svc.update(req.user.sub, id, dto); }
    remove(req, id) { return this.svc.remove(req.user.sub, id); }
    cancel(req, id) { return this.svc.cancel(req.user.sub, id); }
    reverse(req, id) { return this.svc.reverse(req.user.sub, id); }
};
__decorate([
    Get(),
    __param(0, Req()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "list", null);
__decorate([
    Get("summary"),
    __param(0, Req()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "summary", null);
__decorate([
    Get("statistics"),
    __param(0, Req()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "statistics", null);
__decorate([
    Get("statistics/categories"),
    __param(0, Req()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "statisticsCategories", null);
__decorate([
    Get("statistics/monthly"),
    __param(0, Req()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "statisticsMonthly", null);
__decorate([
    Post(),
    Throttle({ default: { limit: 30, ttl: 60000 } }),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateTransactionDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "create", null);
__decorate([
    Get(":id"),
    __param(0, Req()),
    __param(1, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "get", null);
__decorate([
    Put(":id"),
    Throttle({ default: { limit: 30, ttl: 60000 } }),
    __param(0, Req()),
    __param(1, Param("id")),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateTransactionDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "update", null);
__decorate([
    Delete(":id"),
    Throttle({ default: { limit: 30, ttl: 60000 } }),
    __param(0, Req()),
    __param(1, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "remove", null);
__decorate([
    Patch(":id/cancel"),
    Throttle({ default: { limit: 30, ttl: 60000 } }),
    __param(0, Req()),
    __param(1, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "cancel", null);
__decorate([
    Post(":id/reverse"),
    Throttle({ default: { limit: 30, ttl: 60000 } }),
    __param(0, Req()),
    __param(1, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "reverse", null);
TransactionsController = __decorate([
    Controller("transactions"),
    UseGuards(JwtAuthGuard),
    Throttle({ default: { limit: 60, ttl: 60000 } }),
    __metadata("design:paramtypes", [TransactionsService])
], TransactionsController);
export { TransactionsController };
//# sourceMappingURL=transactions.controller.js.map