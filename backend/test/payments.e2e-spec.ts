import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor.js';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter.js';
import cookieParser from 'cookie-parser';
import { Redis } from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { Role, OrderStatus, TransactionStatus } from '@prisma/client';
import { vi } from 'vitest';
import crypto from 'crypto';
import { InvoiceProcessor } from '../src/queue/invoice.processor.js';

// Mock Razorpay
vi.mock('razorpay', () => {
  class RazorpayMock {
    orders = {
      create: vi.fn().mockResolvedValue({ id: 'order_mock123' }),
      fetch: vi.fn().mockImplementation((id) => Promise.resolve({
        id,
        amount: 250000,
        notes: { internalOrderId: (globalThis as any).__TEST_ORDER_ID__ }
      }))
    };
    payments = {
      refund: vi.fn().mockResolvedValue({ id: 'rfnd_mock123' })
    };
  }
  return { default: RazorpayMock };
});

// Mock BullMQ queues
vi.mock('bullmq', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    Queue: vi.fn().mockImplementation(() => ({
      add: vi.fn().mockResolvedValue({ id: 'job-id' }),
      remove: vi.fn().mockResolvedValue(true)
    })),
    Worker: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      close: vi.fn()
    }))
  };
});

describe('PaymentsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: Redis;
  let jwtService: JwtService;

  let learnerToken: string;
  let learnerId: string;
  let courseId: string;
  let couponId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    redis = app.get<Redis>('REDIS_CLIENT');
    jwtService = app.get<JwtService>(JwtService);

    // Clean up
    await prisma.transaction.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.courseModule.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
    await redis.flushall();

    // Setup User
    const learnerUser = await prisma.user.create({
      data: { email: 'buyer@example.com', password: 'hash', role: Role.LEARNER }
    });
    learnerId = learnerUser.id;
    learnerToken = jwtService.sign(
      { sub: learnerId, email: learnerUser.email, role: learnerUser.role },
      { secret: process.env.JWT_SECRET || 'fallback-secret-for-dev' }
    );

    // Setup Course
    const course = await prisma.course.create({
      data: {
        slug: 'paid-course',
        title: 'Paid Course',
        description: 'Learn stuff',
        pricePaise: 500000, // 5000 INR
        format: 'SELF_PACED',
        level: 'BEGINNER',
        language: 'English',
        status: 'PUBLISHED'
      }
    });
    courseId = course.id;

    // Setup Coupon
    const coupon = await prisma.coupon.create({
      data: {
        code: 'HALFOFF',
        discountType: 'PERCENTAGE',
        discountVal: 5000, // 50%
        validUntil: new Date(Date.now() + 86400000), // tomorrow
        usageLimit: 1,
        usageCount: 0
      }
    });
    couponId = coupon.id;
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
    await redis.flushall();
    await app.close();
  });

  let orderIdToTest: string;

  it('POST /payments/checkout - success without coupon', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/payments/checkout')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ courseIds: [courseId] });
      
    if (res.status !== 201) {
      throw new Error('Checkout failed: ' + JSON.stringify(res.body));
    }
    expect(res.status).toBe(201);

    expect(res.body.data.orderId).toBeDefined();
    expect(res.body.data.razorpayOrderId).toBe('order_mock123');
    expect(res.body.data.amount).toBe(500000);

    const order = await prisma.order.findUnique({ where: { id: res.body.data.orderId } });
    expect(order.status).toBe(OrderStatus.PENDING);
    expect(order.expiresAt).toBeDefined();
  });

  it('POST /payments/checkout - success with coupon and atomic decrement check', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/payments/checkout')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ courseIds: [courseId], couponCode: 'HALFOFF' })
      .expect(201);

    expect(res.body.data.amount).toBe(250000); // 50% off 500000
    orderIdToTest = res.body.data.orderId;

    // Verify coupon usageCount incremented
    const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
    expect(coupon.usageCount).toBe(1);
  });

  it('POST /payments/checkout - fails if coupon usage limit reached', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/payments/checkout')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ courseIds: [courseId], couponCode: 'HALFOFF' })
      .expect(400); // Because usageCount is now 1, and limit is 1
  });

  it('POST /payments/webhook - fails with bad signature', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/payments/webhook')
      .set('x-razorpay-signature', 'bad-sig')
      .send({ event: 'payment.captured' })
      .expect(400);
  });

  it('POST /payments/webhook - success creates enrollment', async () => {
    const payload = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_mock123',
            order_id: 'order_mock123',
            amount: 250000,
            notes: {
              internalOrderId: orderIdToTest
            }
          }
        }
      }
    };

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret';
    const signature = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');

    await request(app.getHttpServer())
      .post('/api/v1/payments/webhook')
      .set('x-razorpay-signature', signature)
      .send(payload)
      .expect(200);

    // Verify order completed
    const order = await prisma.order.findUnique({ where: { id: orderIdToTest } });
    expect(order.status).toBe(OrderStatus.COMPLETED);

    // Verify transaction recorded
    const tx = await prisma.transaction.findFirst({ where: { orderId: orderIdToTest } });
    expect(tx).toBeDefined();
    expect(tx.status).toBe(TransactionStatus.SUCCESS);
    expect(tx.razorpayPaymentId).toBe('pay_mock123');

    // Verify enrollment created
    const enrollment = await prisma.enrollment.findFirst({ where: { userId: learnerId, courseId } });
    expect(enrollment).toBeDefined();
  });

  it('POST /payments/webhook - idempotency check (returns 200 on repeat)', async () => {
    const payload = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_mock123',
            order_id: 'order_mock123',
            amount: 250000,
            notes: {
              internalOrderId: orderIdToTest
            }
          }
        }
      }
    };

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret';
    const signature = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');

    await request(app.getHttpServer())
      .post('/api/v1/payments/webhook')
      .set('x-razorpay-signature', signature)
      .send(payload)
      .expect(200);
      
    // Count transactions to ensure no duplicate
    const txCount = await prisma.transaction.count({ where: { orderId: orderIdToTest } });
    expect(txCount).toBe(1);
  });

  it('POST /payments/verify - idempotency check after webhook (returns 200, no duplicate enrollments)', async () => {
    (globalThis as any).__TEST_ORDER_ID__ = orderIdToTest;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret';
    
    // Simulate what the client does
    const payloadToSign = 'order_mock123|pay_mock123';
    const signature = crypto.createHmac('sha256', secret).update(payloadToSign).digest('hex');

    const res = await request(app.getHttpServer())
      .post('/api/v1/payments/verify')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({
        razorpayOrderId: 'order_mock123',
        razorpayPaymentId: 'pay_mock123',
        razorpaySignature: signature
      });
      
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    
    // Check transactions - still exactly 1
    const txCount = await prisma.transaction.count({ where: { orderId: orderIdToTest } });
    expect(txCount).toBe(1);

    // Check enrollments - exactly 1
    const enrollmentCount = await prisma.enrollment.count({ where: { userId: learnerId, courseId } });
    expect(enrollmentCount).toBe(1);
  });

  it('POST /payments/verify then webhook (idempotency race part 2)', async () => {
    // Create a new order for this test
    const checkoutRes = await request(app.getHttpServer())
      .post('/api/v1/payments/checkout')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ courseIds: [courseId] })
      .expect(201);

    const newOrderId = checkoutRes.body.data.orderId;
    (globalThis as any).__TEST_ORDER_ID__ = newOrderId;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret';
    const payloadToSign = 'order_mock456|pay_mock456';
    const signature = crypto.createHmac('sha256', secret).update(payloadToSign).digest('hex');

    // 1. Verify first
    const verifyRes = await request(app.getHttpServer())
      .post('/api/v1/payments/verify')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({
        razorpayOrderId: 'order_mock456',
        razorpayPaymentId: 'pay_mock456',
        razorpaySignature: signature
      });
    expect(verifyRes.status).toBe(200);

    // Assert created
    let txCount = await prisma.transaction.count({ where: { orderId: newOrderId } });
    expect(txCount).toBe(1);

    // 2. Webhook second
    const webhookPayload = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_mock456',
            order_id: 'order_mock456',
            amount: 500000,
            notes: { internalOrderId: newOrderId }
          }
        }
      }
    };
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret';
    const webhookSig = crypto.createHmac('sha256', webhookSecret).update(JSON.stringify(webhookPayload)).digest('hex');

    await request(app.getHttpServer())
      .post('/api/v1/payments/webhook')
      .set('x-razorpay-signature', webhookSig)
      .send(webhookPayload)
      .expect(200);

    // Assert still exactly 1 transaction
    txCount = await prisma.transaction.count({ where: { orderId: newOrderId } });
    expect(txCount).toBe(1);
  });


  it('BullMQ InvoiceProcessor processes the job and sets invoiceUrl on Order', async () => {
    // Since BullMQ is globally mocked, we grab the processor from the module and invoke it manually
    // to simulate the worker picking up the job added by the webhook.
    const processor = app.get(InvoiceProcessor);
    
    await processor.process({ data: { orderId: orderIdToTest } } as any);

    const order = await prisma.order.findUnique({ where: { id: orderIdToTest } });
    expect(order.invoiceUrl).toBeDefined();
    expect(typeof order.invoiceUrl).toBe('string');
  });
});
