import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    const secret = this.config.get<string>("JWT_SECRET");
    if (!secret) {
      throw new InternalServerErrorException("JWT_SECRET is not configured");
    }
  }

  async register(name: string, email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException("E-mail já cadastrado");

    const passwordHash = await argon2.hash(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: { create: { displayName: name } },
      },
      include: { profile: true },
    });

    return this.issueAccessToken(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("Credenciais inválidas");
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException("Credenciais inválidas");
    return this.issueAccessToken(user.id, user.email);
  }

  private issueAccessToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get<string>("JWT_SECRET"),
      expiresIn: "15m",
    });
    return { accessToken, user: { id: userId, email } };
  }
}