import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from '../auth/auth.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';
import * as argon2 from 'argon2';
import { PdfService } from '../payments/pdf.service.js';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly pdfService: PdfService,
  ) {}

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        phone: dto.phone,
      },
      select: { id: true, name: true, email: true, phone: true }
    });

    return { data: user, meta: null };
  }

  async updatePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await argon2.verify(user.password, dto.currentPassword);
    if (!isValid) {
      throw new BadRequestException('Incorrect current password');
    }

    const newPasswordHash = await argon2.hash(dto.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash },
    });

    // Revoke all active sessions
    await this.authService.revokeAllUserSessions(userId);

    return { data: { success: true, message: 'Password changed and sessions revoked. Please log in again.' }, meta: null };
  }

  async getEnrolledCourses(userId: string, query: PaginationQueryDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;

    const [enrollments, total] = await this.prisma.$transaction([
      this.prisma.enrollment.findMany({
        where: { userId },
        include: { course: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.enrollment.count({ where: { userId } }),
    ]);

    return {
      data: enrollments,
      meta: { total, page, pageSize }
    };
  }

  async getUpcomingSessions(userId: string, query: PaginationQueryDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    
    const now = new Date();

    const where = {
      schedule: { gte: now },
      OR: [
        { course: { enrollments: { some: { userId } } } },
        { attendances: { some: { userId } } }
      ]
    };

    const [sessions, total] = await this.prisma.$transaction([
      this.prisma.liveSession.findMany({
        where,
        orderBy: { schedule: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { course: true, instructor: { select: { name: true } } }
      }),
      this.prisma.liveSession.count({ where }),
    ]);

    return {
      data: sessions,
      meta: { total, page, pageSize }
    };
  }

  async getOrderHistory(userId: string, query: PaginationQueryDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;

    const where = { userId };

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          items: { include: { course: true } },
          transactions: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: { total, page, pageSize }
    };
  }

  async getCertificates(userId: string, query: PaginationQueryDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;

    const where = { userId };

    const [certificates, total] = await this.prisma.$transaction([
      this.prisma.certificate.findMany({
        where,
        orderBy: { issuedAt: 'desc' },
        include: { course: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.certificate.count({ where }),
    ]);

    return {
      data: certificates,
      meta: { total, page, pageSize }
    };
  }

  async getDoubts(userId: string, query: PaginationQueryDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;

    const where = { userId };

    const [doubts, total] = await this.prisma.$transaction([
      this.prisma.doubt.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { lesson: true, liveSession: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.doubt.count({ where }),
    ]);

    return {
      data: doubts,
      meta: { total, page, pageSize }
    };
  }

  async downloadCertificate(userId: string, courseId: string): Promise<Buffer> {
    const certificate = await this.prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { user: true, course: true }
    });

    if (!certificate) {
      throw new BadRequestException('Certificate not found or course not completed');
    }

    const dateStr = certificate.issuedAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return this.pdfService.generateCertificateBuffer(
      certificate.user.name,
      certificate.course.title,
      dateStr
    );
  }
}
