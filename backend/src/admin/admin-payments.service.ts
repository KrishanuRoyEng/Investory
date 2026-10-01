import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaymentsService } from '../payments/payments.service.js';
import { OrderStatus, DiscountType, Prisma } from '@prisma/client';

@Injectable()
export class AdminPaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
  ) {}

  buildOrderWhereClause(status?: OrderStatus, startDate?: string, endDate?: string): Prisma.OrderWhereInput {
    const where: Prisma.OrderWhereInput = {};
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    return where;
  }

  async findAllOrders(page: number = 1, pageSize: number = 20, status?: OrderStatus, startDate?: string, endDate?: string) {
    const skip = (page - 1) * pageSize;
    const where = this.buildOrderWhereClause(status, startDate, endDate);
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } }, transactions: true },
      }),
      this.prisma.order.count(),
    ]);

    return { orders, total, page, pageSize };
  }

  async refundOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.COMPLETED) {
      throw new ConflictException(`Cannot refund order in state: ${order.status}`);
    }

    return this.paymentsService.refundOrder(orderId);
  }

  buildCouponWhereClause(startDate?: string, endDate?: string): Prisma.CouponWhereInput {
    const where: Prisma.CouponWhereInput = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    return where;
  }

  async findAllCoupons(page: number = 1, pageSize: number = 20, startDate?: string, endDate?: string) {
    const skip = (page - 1) * pageSize;
    const where = this.buildCouponWhereClause(startDate, endDate);
    const [coupons, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.coupon.count(),
    ]);

    return { coupons, total, page, pageSize };
  }

  async createCoupon(
    code: string,
    discountType: DiscountType,
    discountVal: number,
    validUntil: Date,
    usageLimit?: number
  ) {
    const existing = await this.prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      throw new ConflictException('Coupon with this code already exists');
    }

    return this.prisma.coupon.create({
      data: {
        code,
        discountType,
        discountVal,
        validUntil,
        usageLimit,
      },
    });
  }
}
