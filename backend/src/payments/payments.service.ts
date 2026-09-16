import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CheckoutDto } from './dto/checkout.dto.js';
import { OrderStatus, TransactionStatus } from '@prisma/client';
import Razorpay from 'razorpay';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpay: any;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @InjectQueue('order-expiry') private readonly orderExpiryQueue: Queue,
    @InjectQueue('invoice') private readonly invoiceQueue: Queue,
  ) {
    const key_id = this.configService.get<string>('RAZORPAY_KEY_ID') || 'rzp_test_123';
    const key_secret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'rzp_test_secret';
    
    // In test environments we can mock Razorpay, but we initialize it anyway
    this.razorpay = new Razorpay({ key_id, key_secret });
  }

  async checkout(userId: string, dto: CheckoutDto) {
    const { courseIds, couponCode } = dto;

    const courses = await this.prisma.course.findMany({
      where: { id: { in: courseIds } }
    });

    if (courses.length !== courseIds.length) {
      throw new BadRequestException('One or more invalid course IDs provided');
    }

    let subtotal = courses.reduce((sum, c) => sum + c.pricePaise, 0);
    let discountPaise = 0;
    let appliedCouponId = null;

    if (couponCode) {
      const coupon = await this.prisma.coupon.findUnique({ where: { code: couponCode } });
      
      if (!coupon) {
        throw new BadRequestException('Invalid coupon code');
      }
      
      if (coupon.validUntil < new Date()) {
        throw new BadRequestException('Coupon has expired');
      }

      if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
        throw new BadRequestException('Coupon usage limit reached');
      }

      // Atomic conditional update for coupon usage
      const updatedCoupon = await this.prisma.$executeRaw`
        UPDATE "Coupon"
        SET "usageCount" = "usageCount" + 1
        WHERE "id" = ${coupon.id} AND ("usageLimit" IS NULL OR "usageCount" < "usageLimit")
      `;

      if (updatedCoupon === 0) {
        throw new BadRequestException('Coupon usage limit reached during checkout');
      }

      appliedCouponId = coupon.id;

      if (coupon.discountType === 'FLAT') {
        discountPaise = coupon.discountVal;
      } else if (coupon.discountType === 'PERCENTAGE') {
        discountPaise = Math.floor((subtotal * coupon.discountVal) / 10000); // assuming basis points for precision
      }

      // Don't discount more than the subtotal
      if (discountPaise > subtotal) {
        discountPaise = subtotal;
      }
    }

    const totalPaise = subtotal - discountPaise;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    const order = await this.prisma.order.create({
      data: {
        userId,
        totalPaise,
        discountPaise,
        appliedCouponId,
        status: OrderStatus.PENDING,
        expiresAt,
        items: {
          create: courses.map(c => ({
            courseId: c.id,
            pricePaise: c.pricePaise,
          }))
        }
      }
    });

    // Schedule delayed expiry job
    await this.orderExpiryQueue.add('expire', { orderId: order.id }, {
      delay: 30 * 60 * 1000,
      jobId: `expiry-${order.id}`, // using jobId to easily remove/cancel it later
    });

    let rzpOrder;
    try {
      rzpOrder = await this.razorpay.orders.create({
        amount: totalPaise,
        currency: 'INR',
        receipt: order.id,
        notes: {
          internalOrderId: order.id,
        }
      });
    } catch (err) {
      this.logger.error('Failed to create Razorpay order', err);
      // In a real scenario we might fallback or retry, for now just fail.
      throw new BadRequestException('Payment gateway error');
    }


    return {
      data: {
        orderId: order.id,
        razorpayOrderId: rzpOrder.id,
        amount: totalPaise,
        currency: 'INR',
      },
      meta: null
    };
  }

  async handleWebhook(body: any, signature: string) {
    const secret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET') || 'rzp_webhook_secret';
    
    // 1. Verify Signature FIRST
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    if (body.event !== 'payment.captured' && body.event !== 'payment.failed') {
      return { received: true };
    }

    const payment = body.payload.payment.entity;
    const rzpOrderId = payment.order_id;
    const rzpPaymentId = payment.id;
    
    const orderId = payment.notes?.internalOrderId;
    
    if (!orderId) {
      this.logger.warn(`Webhook received for Razorpay Order ${rzpOrderId} but no internal orderId found in notes.`);
      return { received: true };
    }

    // Idempotency check:
    const transaction = await this.prisma.transaction.findFirst({
      where: { razorpayOrderId: rzpOrderId, status: TransactionStatus.SUCCESS }
    });

    if (transaction) {
      this.logger.log(`Webhook already processed for ${rzpOrderId}`);
      return { received: true }; // Short-circuit early
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order || order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED) {
      return { received: true };
    }

    if (body.event === 'payment.failed') {
      await this.prisma.$transaction(async (tx) => {
        await tx.transaction.create({
          data: {
            orderId: order.id,
            amountPaise: payment.amount,
            razorpayPaymentId: rzpPaymentId,
            razorpayOrderId: rzpOrderId,
            status: TransactionStatus.FAILED
          }
        });

        await tx.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.CANCELLED }
        });

        // Release coupon reservation if applied
        if (order.appliedCouponId) {
          await tx.$executeRaw`
            UPDATE "Coupon"
            SET "usageCount" = "usageCount" - 1
            WHERE "id" = ${order.appliedCouponId} AND "usageCount" > 0
          `;
        }
      });

      // Cancel the expiry job
      await this.orderExpiryQueue.remove(`expiry-${order.id}`);
      return { received: true };
    }

    // Process success
    await this.processSuccessfulPayment(order.id, payment.amount, rzpPaymentId, rzpOrderId);
    return { received: true };
  }

  private async processSuccessfulPayment(orderId: string, amountPaise: number, rzpPaymentId: string, rzpOrderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) return;

    await this.prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          orderId: order.id,
          amountPaise,
          razorpayPaymentId: rzpPaymentId,
          razorpayOrderId: rzpOrderId,
          status: TransactionStatus.SUCCESS
        }
      });

      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.COMPLETED }
      });

      // Create enrollments safely
      await tx.enrollment.createMany({
        data: order.items.map(item => ({
          userId: order.userId,
          courseId: item.courseId,
        })),
        skipDuplicates: true,
      });
    });

    // Cancel the expiry job
    await this.orderExpiryQueue.remove(`expiry-${order.id}`);

    // Schedule invoice job
    await this.invoiceQueue.add('generate', { orderId: order.id });
  }

  async verifyPayment(userId: string, dto: import('./dto/verify-payment.dto.js').VerifyPaymentDto) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = dto;
    
    const key_secret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'rzp_test_secret';

    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      throw new BadRequestException('Invalid payment signature');
    }

    // Fetch the order from Razorpay to get our internal order ID
    let rzpOrder;
    try {
      rzpOrder = await this.razorpay.orders.fetch(razorpayOrderId);
    } catch (err) {
      this.logger.error('Failed to fetch Razorpay order during verification', err);
      throw new BadRequestException('Failed to verify payment gateway status');
    }

    const orderId = rzpOrder.notes?.internalOrderId;
    if (!orderId) {
      throw new BadRequestException('Invalid order mapping');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Unauthorized order verification');
    }

    // Idempotency check: Ensure we don't process it twice
    const existingTx = await this.prisma.transaction.findFirst({
      where: { razorpayOrderId, status: TransactionStatus.SUCCESS }
    });

    if (existingTx) {
      // Already processed (maybe by webhook), just return success
      return { success: true };
    }

    if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED) {
      return { success: true };
    }

    // Process success
    await this.processSuccessfulPayment(orderId, rzpOrder.amount, razorpayPaymentId, razorpayOrderId);

    return { success: true };
  }
  async refundOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { transactions: true, items: true }
    });

    if (!order || order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('Order is not eligible for refund');
    }

    const successfulTx = order.transactions.find(t => t.status === TransactionStatus.SUCCESS);
    if (!successfulTx || !successfulTx.razorpayPaymentId) {
      throw new BadRequestException('No successful transaction found to refund');
    }

    // Call Razorpay refund
    try {
      await this.razorpay.payments.refund(successfulTx.razorpayPaymentId, {
        amount: successfulTx.amountPaise
      });
    } catch (err) {
      this.logger.error('Failed to process refund with Razorpay', err);
      throw new BadRequestException('Failed to process refund');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.REFUNDED }
      });

      // Revoke enrollments
      const courseIds = order.items.map(i => i.courseId);
      await tx.enrollment.deleteMany({
        where: {
          userId: order.userId,
          courseId: { in: courseIds }
        }
      });
    });

    return { data: { success: true }, meta: null };
  }
}
