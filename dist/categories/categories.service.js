var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(userId, type, includeInactive = false) {
        return this.prisma.category.findMany({
            where: {
                OR: [{ userId: null }, { userId }],
                ...(type ? { type: type } : {}),
                ...(includeInactive ? {} : { isActive: true }),
            },
            orderBy: { label: "asc" },
        });
    }
    async get(userId, id) {
        const c = await this.prisma.category.findFirst({ where: { id, OR: [{ userId: null }, { userId }] } });
        if (!c)
            throw new NotFoundException("Categoria não encontrada");
        return c;
    }
    async create(userId, dto) {
        return this.prisma.category.create({
            data: { id: dto.label.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(), label: dto.label, type: dto.type, icon: dto.icon, color: dto.color, isCustom: true, userId },
        });
    }
    async update(userId, id, dto) {
        const c = await this.prisma.category.findFirst({ where: { id } });
        if (!c)
            throw new NotFoundException("Categoria não encontrada");
        if (c.userId === null)
            throw new ForbiddenException("Categoria global não pode ser alterada");
        if (c.userId !== userId)
            throw new ForbiddenException("Sem permissão");
        return this.prisma.category.update({ where: { id }, data: { ...(dto.label && { label: dto.label }), ...(dto.icon !== undefined && { icon: dto.icon }), ...(dto.color !== undefined && { color: dto.color }), ...(dto.isActive !== undefined && { isActive: dto.isActive }) } });
    }
    async archive(userId, id) {
        const c = await this.prisma.category.findFirst({ where: { id } });
        if (!c)
            throw new NotFoundException("Categoria não encontrada");
        if (c.userId === null)
            throw new ForbiddenException("Categoria global não pode ser arquivada");
        if (c.userId !== userId)
            throw new ForbiddenException("Sem permissão");
        return this.prisma.category.update({ where: { id }, data: { isActive: false } });
    }
};
CategoriesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CategoriesService);
export { CategoriesService };
//# sourceMappingURL=categories.service.js.map