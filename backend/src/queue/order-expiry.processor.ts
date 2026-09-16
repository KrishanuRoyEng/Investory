import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrderStatus } from '@prisma/client';

@Processor('order-expiry')
export class OrderExpiryProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderExpiryProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<{ orderId: string }, any, string>): Promise<any> {
    const { orderId } = job.data;
    this.logger.log(`Processing expiry for Order: ${orderId}`);

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    
    if (!order) {
      this.logger.log(`Order ${orderId} not found, skipping expiry.`);
      return;
    }

    if (order.status !== OrderStatus.PENDING) {
      this.logger.log(`Order ${orderId} is ${order.status}, skipping expiry.`);
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      // Re-fetch with lock for safety
      const lockedOrder = await tx.order.findUnique({
        where: { id: orderId },
        // Normally we'd use SELECT FOR UPDATE, but Prisma doesn't natively support it outside of raw queries.
        // We rely on the status check and isolation level.
      });

      if (lockedOrder?.status !== OrderStatus.PENDING) return;

      // Update order to CANCELLED
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });

      // Release coupon usage if one was applied
      if (lockedOrder.appliedCouponId) {
        await tx.coupon.update({
          where: { id: lockedOrder.appliedCouponId },
          data: { usageCount: { decrement: 1 } },
        });
        this.logger.log(`Released coupon usage for ${lockedOrder.appliedCouponId}`);
      }
    });

    this.logger.log(`Order ${orderId} successfully expired and cancelled.`);
    return {};
  }
}
