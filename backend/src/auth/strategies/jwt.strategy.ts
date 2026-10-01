import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('access_token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret-for-dev',
    });
  }

  async validate(payload: any) {
    let permissions: string[] = [];
    if (payload.role === 'STAFF') {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { staffRole: true },
      });
      permissions = user?.staffRole?.permissions || [];
    }
    return { userId: payload.sub, email: payload.email, role: payload.role, permissions };
  }
}
