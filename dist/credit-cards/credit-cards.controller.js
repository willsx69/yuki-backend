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
import { CreditCardsService } from "./credit-cards.service.js";
import { Throttle } from "@nestjs/throttler";
import { CreateCreditCardDto } from "./dto/create-credit-card.dto.js";
import { UpdateCreditCardDto } from "./dto/update-credit-card.dto.js";
import { PayInvoiceDto } from "./dto/pay-invoice.dto.js";
let CreditCardsController = class CreditCardsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    list(req) { return this.svc.list(req.user.sub); }
    create(req, dto) { return this.svc.create(req.user.sub, dto); }
    get(req, id) { return this.svc.get(req.user.sub, id); }
    update(req, id, dto) { return this.svc.update(req.user.sub, id, dto); }
    archive(req, id) { return this.svc.archive(req.user.sub, id); }
    invoices(req, id) { return this.svc.listInvoices(req.user.sub, id); }
};
__decorate([
    Get(),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CreditCardsController.prototype, "list", null);
__decorate([
    Post(),
    Throttle({ default: { limit: 30, ttl: 60000 } }),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateCreditCardDto]),
    __metadata("design:returntype", void 0)
], CreditCardsController.prototype, "create", null);
__decorate([
    Get(":id"),
    __param(0, Request()),
    __param(1, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CreditCardsController.prototype, "get", null);
__decorate([
    Patch(":id"),
    Throttle({ default: { limit: 30, ttl: 60000 } }),
    __param(0, Request()),
    __param(1, Param("id")),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateCreditCardDto]),
    __metadata("design:returntype", void 0)
], CreditCardsController.prototype, "update", null);
__decorate([
    Delete(":id"),
    Throttle({ default: { limit: 30, ttl: 60000 } }),
    __param(0, Request()),
    __param(1, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CreditCardsController.prototype, "archive", null);
__decorate([
    Get(":id/invoices"),
    __param(0, Request()),
    __param(1, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CreditCardsController.prototype, "invoices", null);
CreditCardsController = __decorate([
    Controller("credit-cards"),
    UseGuards(JwtAuthGuard),
    Throttle({ default: { limit: 60, ttl: 60000 } }),
    __metadata("design:paramtypes", [CreditCardsService])
], CreditCardsController);
export { CreditCardsController };
let CreditCardInvoicesController = class CreditCardInvoicesController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    get(req, id) { return this.svc.getInvoice(req.user.sub, id); }
    transactions(req, id) { return this.svc.getInvoiceTransactions(req.user.sub, id); }
    pay(req, id, dto) { return this.svc.payInvoice(req.user.sub, id, dto); }
};
__decorate([
    Get(":id"),
    __param(0, Request()),
    __param(1, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CreditCardInvoicesController.prototype, "get", null);
__decorate([
    Get(":id/transactions"),
    __param(0, Request()),
    __param(1, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CreditCardInvoicesController.prototype, "transactions", null);
__decorate([
    Post(":id/payments"),
    Throttle({ default: { limit: 30, ttl: 60000 } }),
    __param(0, Request()),
    __param(1, Param("id")),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, PayInvoiceDto]),
    __metadata("design:returntype", void 0)
], CreditCardInvoicesController.prototype, "pay", null);
CreditCardInvoicesController = __decorate([
    Controller("credit-card-invoices"),
    UseGuards(JwtAuthGuard),
    Throttle({ default: { limit: 60, ttl: 60000 } }),
    __metadata("design:paramtypes", [CreditCardsService])
], CreditCardInvoicesController);
export { CreditCardInvoicesController };
//# sourceMappingURL=credit-cards.controller.js.map