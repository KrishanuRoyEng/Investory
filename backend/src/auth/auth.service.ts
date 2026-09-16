import { Injectable, ConflictException, UnauthorizedException, ForbiddenException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RequestOtpDto, LoginOtpDto, ForgotPasswordDto, ResetPasswordDto } from './dto/otp-reset.dto.js';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { Redis } from 'ioredis';
import type { Response } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private redis: Redis,
  ) {}

  async signup(dto: SignupDto, res: Response) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        phone: dto.phone,
      },
    });

    return this.generateTokensAndSetCookie(user, res);
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Account deactivated');
    }

    const isValid = await argon2.verify(user.password, dto.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokensAndSetCookie(user, res);
  }

  async refresh(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    // Try finding the token family details from Redis
    // We store tokens using key: `token:${tokenString}` -> value: `familyId:userId`
    const tokenData = await this.redis.get(`token:${refreshToken}`);

    if (!tokenData) {
      // If we can't find the token, it could be expired OR it could be an already used one.
      // We also track used tokens for reuse detection.
      const usedData = await this.redis.get(`used_token:${refreshToken}`);
      if (usedData) {
        // REUSE DETECTED!
        const [familyId] = usedData.split(':');
        // Revoke the entire family
        await this.revokeFamily(familyId);
        // Clear cookie
        this.clearCookie(res);
        throw new UnauthorizedException('Token reuse detected. Family revoked.');
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const [familyId, userId] = tokenData.split(':');

    // Mark current token as used
    await this.redis.setex(`used_token:${refreshToken}`, 7 * 24 * 60 * 60, `${familyId}:${userId}`);
    await this.redis.del(`token:${refreshToken}`);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateTokensAndSetCookie(user, res, familyId);
  }

  async logout(refreshToken: string, res: Response) {
    if (refreshToken) {
      const tokenData = await this.redis.get(`token:${refreshToken}`);
      if (tokenData) {
        const [familyId] = tokenData.split(':');
        await this.revokeFamily(familyId);
      }
    }
    this.clearCookie(res);
    return { success: true };
  }

  async revokeAllUserSessions(userId: string) {
    const families = await this.redis.smembers(`user_families:${userId}`);
    for (const familyId of families) {
      await this.revokeFamily(familyId);
    }
    await this.redis.del(`user_families:${userId}`);
  }

  async deactivateAccount(userId: string, res: Response) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
    await this.revokeAllUserSessions(userId);
    this.clearCookie(res);
    return { success: true };
  }

  async requestOtp(dto: RequestOtpDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      // Return success even if user doesn't exist (prevent enumeration)
      return { success: true, message: 'If the email exists, an OTP has been sent.' };
    }

    if (!user.isActive) {
      // Return success to prevent enumeration of deactivated accounts
      return { success: true, message: 'If the email exists, an OTP has been sent.' };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in Redis (5 min TTL)
    await this.redis.setex(`otp:${dto.email}`, 300, otp);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV ONLY] OTP for ${dto.email} is ${otp}`);
    } else {
      // TODO(api-stub): Integrate real SMS/Email service
    }

    return { success: true, message: 'If the email exists, an OTP has been sent.' };
  }

  async loginOtp(dto: LoginOtpDto, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid OTP or email');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Account deactivated');
    }

    const savedOtp = await this.redis.get(`otp:${dto.email}`);
    if (!savedOtp) {
      throw new UnauthorizedException('OTP has expired or was not requested');
    }
    if (savedOtp !== dto.otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Clear OTP after successful use
    await this.redis.del(`otp:${dto.email}`);

    return this.generateTokensAndSetCookie(user, res);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      // Prevent user enumeration
      return { success: true, message: 'If the email exists, a password reset link has been sent.' };
    }

    if (!user.isActive) {
      // Actually we still return the same success message to prevent enumeration
      return { success: true, message: 'If the email exists, a password reset link has been sent.' };
    }

    const resetToken = uuidv4();
    await this.redis.setex(`reset_token:${resetToken}`, 900, user.id); // 15 min TTL

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV ONLY] Reset token for ${dto.email} is ${resetToken}`);
    } else {
      // TODO(api-stub): Integrate real Email service for reset link
    }

    return { success: true, message: 'If the email exists, a password reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const userId = await this.redis.get(`reset_token:${dto.token}`);
    if (!userId) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await argon2.hash(dto.password);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Revoke all existing sessions and the reset token
    await this.revokeAllUserSessions(userId);
    await this.redis.del(`reset_token:${dto.token}`);

    return { success: true, message: 'Password has been reset successfully.' };
  }

  private async revokeFamily(familyId: string) {
    // Find all active tokens for this family using a set
    const tokens = await this.redis.smembers(`family:${familyId}`);
    if (tokens.length > 0) {
      await this.redis.del(...tokens.map(t => `token:${t}`));
    }
    await this.redis.del(`family:${familyId}`);
  }

  private async generateTokensAndSetCookie(user: User, res: Response, existingFamilyId?: string) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = uuidv4();
    const familyId = existingFamilyId || uuidv4();

    // Store in Redis with 7 days expiration
    const ttl = 7 * 24 * 60 * 60;
    await this.redis.setex(`token:${refreshToken}`, ttl, `${familyId}:${user.id}`);
    
    // Add token to the family set. The set itself should expire to avoid memory leaks.
    await this.redis.sadd(`family:${familyId}`, refreshToken);
    await this.redis.expire(`family:${familyId}`, ttl);

    // Track families per user
    await this.redis.sadd(`user_families:${user.id}`, familyId);
    await this.redis.expire(`user_families:${user.id}`, ttl);

    // Set cookie
    const isDev = process.env.NODE_ENV !== 'production';
    const sameSiteConfig = process.env.COOKIE_SAME_SITE?.toLowerCase() === 'none' ? 'none' : 'strict';
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: sameSiteConfig === 'none' ? true : !isDev,
      sameSite: sameSiteConfig,
      path: '/api/v1/auth',
      maxAge: ttl * 1000,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    };
  }

  private clearCookie(res: Response) {
    const isDev = process.env.NODE_ENV !== 'production';
    const sameSiteConfig = process.env.COOKIE_SAME_SITE?.toLowerCase() === 'none' ? 'none' : 'strict';

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: sameSiteConfig === 'none' ? true : !isDev,
      sameSite: sameSiteConfig,
      path: '/api/v1/auth',
    });
  }
}
