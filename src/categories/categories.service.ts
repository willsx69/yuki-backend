import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  list(userId: string, type?: string, includeInactive = false) {
    return this.prisma.category.findMany({
      where: {
        OR: [{ userId: null }, { userId }],
        ...(type ? { type: type as any } : {}),
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { label: "asc" },
    });
  }

  async get(userId: string, id: string) {
    const c = await this.prisma.category.findFirst({ where: { id, OR: [{ userId: null }, { userId }] } });
    if (!c) throw new NotFoundException("Categoria não encontrada");
    return c;
  }

  async create(userId: string, dto: { label: string; type: "income" | "expense"; icon?: string; color?: string }) {
    return this.prisma.category.create({
      data: { id: dto.label.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(), label: dto.label, type: dto.type as any, icon: dto.icon, color: dto.color, isCustom: true, userId },
    });
  }

  async update(userId: string, id: string, dto: { label?: string; icon?: string; color?: string; isActive?: boolean }) {
    const c = await this.prisma.category.findFirst({ where: { id } });
    if (!c) throw new NotFoundException("Categoria não encontrada");
    if (c.userId === null) throw new ForbiddenException("Categoria global não pode ser alterada");
    if (c.userId !== userId) throw new ForbiddenException("Sem permissão");
    return this.prisma.category.update({ where: { id }, data: { ...(dto.label && { label: dto.label }), ...(dto.icon !== undefined && { icon: dto.icon }), ...(dto.color !== undefined && { color: dto.color }), ...(dto.isActive !== undefined && { isActive: dto.isActive }) } });
  }

  async archive(userId: string, id: string) {
    const c = await this.prisma.category.findFirst({ where: { id } });
    if (!c) throw new NotFoundException("Categoria não encontrada");
    if (c.userId === null) throw new ForbiddenException("Categoria global não pode ser arquivada");
    if (c.userId !== userId) throw new ForbiddenException("Sem permissão");
    return this.prisma.category.update({ where: { id }, data: { isActive: false } });
  }
}