import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { Role, CourseFormat, CourseLevel, CourseStatus, LiveSessionType, OrderStatus, TransactionStatus, DoubtStatus } from '@prisma/client';
import * as argon2 from 'argon2';

describe('DashboardController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  
  let learnerToken: string;
  let learnerId: string;
  let courseId: string;
  let orderId: string;
  let sessionId: string;
  let doubtId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

    // Clean up
    await prisma.transaction.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.doubt.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.liveSession.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    // Create user
    const passwordHash = await argon2.hash('password123');
    const user = await prisma.user.create({
      data: {
        name: 'Learner User',
        email: 'learner-dashboard@example.com',
        password: passwordHash,
        role: Role.LEARNER,
        phone: '1234567890',
      }
    });
    learnerId = user.id;

    // Create token
    learnerToken = jwtService.sign({ sub: learnerId, email: user.email, role: user.role }, { secret: process.env.JWT_SECRET || 'fallback-secret-for-dev' });

    // Seed data
    const course = await prisma.course.create({
      data: {
        slug: 'dashboard-course',
        title: 'Dashboard Course',
        description: 'Test',
        pricePaise: 100000,
        format: CourseFormat.SELF_PACED,
        level: CourseLevel.BEGINNER,
        status: CourseStatus.PUBLISHED,
        language: 'English',
      }
    });
    courseId = course.id;

    await prisma.enrollment.create({
      data: {
        userId: learnerId,
        courseId: course.id,
        progressPercent: 50,
      }
    });

    const order = await prisma.order.create({
      data: {
        userId: learnerId,
        totalPaise: 100000,
        status: OrderStatus.COMPLETED,
        items: {
          create: [{ courseId: course.id, pricePaise: 100000 }]
        },
        transactions: {
          create: [{ amountPaise: 100000, status: TransactionStatus.SUCCESS }]
        }
      }
    });
    orderId = order.id;

    const session = await prisma.liveSession.create({
      data: {
        title: 'Q&A Session',
        type: LiveSessionType.CLASS,
        schedule: new Date(Date.now() + 86400000), // tomorrow
        instructorId: learnerId, // just reusing the user as instructor for simplicity of seeding
        courseId: course.id,
      }
    });
    sessionId = session.id;

    const doubt = await prisma.doubt.create({
      data: {
        userId: learnerId,
        question: 'How does dashboard work?',
        status: DoubtStatus.OPEN,
      }
    });
    doubtId = doubt.id;

    await prisma.certificate.create({
      data: {
        userId: learnerId,
        courseId: course.id,
        url: 'https://example.com/cert.pdf',
      }
    });
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.doubt.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.liveSession.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
    
    await app.close();
  });

  it('PUT /dashboard/profile should update name and phone', async () => {
    const res = await request(app.getHttpServer())
      .put('/dashboard/profile')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({
        name: 'Updated Name',
        phone: '9999999999'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Updated Name');
    expect(res.body.data.phone).toBe('9999999999');
  });

  it('GET /dashboard/courses should return enrollments with pagination', async () => {
    const res = await request(app.getHttpServer())
      .get('/dashboard/courses?page=1&pageSize=10')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].course.title).toBe('Dashboard Course');
    expect(res.body.meta.total).toBe(1);
  });

  it('GET /dashboard/sessions should return upcoming sessions', async () => {
    const res = await request(app.getHttpServer())
      .get('/dashboard/sessions')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Q&A Session');
  });

  it('GET /dashboard/orders should return order history', async () => {
    const res = await request(app.getHttpServer())
      .get('/dashboard/orders')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].items[0].courseId).toBe(courseId);
  });

  it('GET /dashboard/certificates should return certificates', async () => {
    const res = await request(app.getHttpServer())
      .get('/dashboard/certificates')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].url).toBe('https://example.com/cert.pdf');
  });

  it('GET /dashboard/doubts should return doubts', async () => {
    const res = await request(app.getHttpServer())
      .get('/dashboard/doubts')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].question).toBe('How does dashboard work?');
  });

  it('PUT /dashboard/password should fail with wrong current password', async () => {
    const res = await request(app.getHttpServer())
      .put('/dashboard/password')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123'
      });

    expect(res.status).toBe(400); // BadRequestException
  });

  it('PUT /dashboard/password should succeed with correct current password', async () => {
    const res = await request(app.getHttpServer())
      .put('/dashboard/password')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({
        currentPassword: 'password123',
        newPassword: 'newpassword123'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.success).toBe(true);
    
    // Check headers for Set-Cookie with clearCookie format (Max-Age=0 or Expires in past)
    const setCookie = res.headers['set-cookie'];
    if (setCookie) {
      expect(setCookie.some(cookie => cookie.includes('refreshToken=;') || cookie.includes('Max-Age=0') || cookie.includes('Expires=Thu, 01 Jan 1970'))).toBeTruthy();
    }
  });

  it('PUT /dashboard/password should enforce rate limit (429) after 5 requests', async () => {
    // Send 5 rapid requests with invalid password to exhaust the throttle without logging out
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .put('/dashboard/password')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123'
        });
    }

    // The 6th request should be rate limited (429)
    const res = await request(app.getHttpServer())
      .put('/dashboard/password')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123'
      });

    expect(res.status).toBe(429);
  });
});
