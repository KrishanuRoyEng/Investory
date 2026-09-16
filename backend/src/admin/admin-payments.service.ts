import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaymentsService } from '../payments/payments.service.js';
import { OrderStatus, DiscountType } from '@prisma/client';

@Injectable()
export class AdminPaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async findAllOrders(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
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

  async findAllCoupons(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const [coupons, total] = await Promise.all([
      this.prisma.coupon.findMany({
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
