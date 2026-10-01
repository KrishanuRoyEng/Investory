import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Role, Prisma } from '@prisma/client';

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  buildWhereClause(startDate?: string, endDate?: string): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    return where;
  }

  async findAll(page: number = 1, pageSize: number = 20, startDate?: string, endDate?: string) {
    const skip = (page - 1) * pageSize;
    const where = this.buildWhereClause(startDate, endDate);
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          staffRoleId: true,
          staffRole: { select: { name: true } },
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return { users, total, page, pageSize };
  }

  async updateUser(id: string, name?: string, phone?: string, role?: Role, staffRoleId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (phone !== undefined) data.phone = phone;
    if (role !== undefined) data.role = role;
    if (staffRoleId !== undefined) data.staffRoleId = staffRoleId || null;

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        staffRoleId: true,
        staffRole: { select: { name: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
