import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor.js';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter.js';
import cookieParser from 'cookie-parser';
import { Role, OrderStatus, DiscountType } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PdfService } from '../src/payments/pdf.service.js';
import { StorageService } from '../src/storage/storage.service.js';

describe('AdminModule (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  let adminToken: string;
  let instructorToken: string;
  let instructor2Token: string;
  let learnerToken: string;

  let adminId: string;
  let instructorId: string;
  let instructor2Id: string;
  let learnerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());
    app.use(cookieParser());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

    // Clean up from previous aborted runs
    await prisma.transaction.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.certificate.deleteMany({});
    await prisma.attendance.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.courseModule.deleteMany({});
    await prisma.liveSession.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: { contains: '-admin@example.com' } }
    });

    // Create Admin
    const adminUser = await prisma.user.create({
      data: { email: 'admin-admin@example.com', password: 'hash', role: Role.ADMIN }
    });
    adminId = adminUser.id;
    adminToken = jwtService.sign({ sub: adminUser.id, email: adminUser.email, role: adminUser.role }, { secret: process.env.JWT_SECRET || 'fallback-secret-for-dev' });

    // Create Instructors
    const instructor1 = await prisma.user.create({
      data: { email: 'inst1-admin@example.com', password: 'hash', role: Role.INSTRUCTOR }
    });
    instructorId = instructor1.id;
    instructorToken = jwtService.sign({ sub: instructor1.id, email: instructor1.email, role: instructor1.role }, { secret: process.env.JWT_SECRET || 'fallback-secret-for-dev' });

    const instructor2 = await prisma.user.create({
      data: { email: 'inst2-admin@example.com', password: 'hash', role: Role.INSTRUCTOR }
    });
    instructor2Id = instructor2.id;
    instructor2Token = jwtService.sign({ sub: instructor2.id, email: instructor2.email, role: instructor2.role }, { secret: process.env.JWT_SECRET || 'fallback-secret-for-dev' });

    // Create Learner
    const learner = await prisma.user.create({
      data: { email: 'learner-admin@example.com', password: 'hash', role: Role.LEARNER }
    });
    learnerId = learner.id;
    learnerToken = jwtService.sign({ sub: learner.id, email: learner.email, role: learner.role }, { secret: process.env.JWT_SECRET || 'fallback-secret-for-dev' });
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.certificate.deleteMany({});
    await prisma.coupon.deleteMany({});
    await prisma.attendance.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.courseModule.deleteMany({});
    await prisma.liveSession.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: { contains: '-admin@example.com' } }
    });
    await app.close();
  });

  describe('Users CRUD', () => {
    it('GET /admin/users should be forbidden for instructor', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${instructorToken}`)
        .expect(403);
    });

    it('GET /admin/users should allow admin', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(res.body.data.users.length).toBeGreaterThan(0);
    });

    it('PUT /admin/users/:id should allow admin to promote learner', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/v1/admin/users/${learnerId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: Role.INSTRUCTOR })
        .expect(200);
      
      expect(res.body.data.role).toBe(Role.INSTRUCTOR);

      // Revert back
      await prisma.user.update({ where: { id: learnerId }, data: { role: Role.LEARNER } });
    });
  });

  describe('Payments CRUD (Orders & Coupons)', () => {
    let orderId: string;
    beforeAll(async () => {
      const order = await prisma.order.create({
        data: {
          userId: learnerId,
          status: OrderStatus.PENDING,
          totalPaise: 5000,
        }
      });
      orderId = order.id;
    });

    afterAll(async () => {
      await prisma.order.deleteMany({ where: { id: orderId } });
    });

    it('POST /admin/orders/:id/refund should reject PENDING orders', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/admin/orders/${orderId}/refund`)
        .set('Authorization', `Bearer ${adminToken}`);
        
      if (res.status !== 409) console.log('Refund error:', res.body);
      expect(res.status).toBe(409);
      expect(res.body.error.message).toContain('Cannot refund order in state: PENDING');
    });

    it('POST /admin/coupons should create a coupon (enum test)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/admin/coupons')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          code: 'SUMMER20',
          discountType: 'PERCENTAGE',
          discountVal: 2000,
          validUntil: new Date(Date.now() + 86400000).toISOString(),
        })
        .expect(201);
      
      expect(res.body.data.code).toBe('SUMMER20');
      expect(res.body.data.discountType).toBe(DiscountType.PERCENTAGE);
    });
  });

  describe('Schedules CRUD (Instructor Scoping)', () => {
    let courseId: string;
    let sessionId: string;

    beforeAll(async () => {
      const course = await prisma.course.create({
        data: {
          slug: 'admin-test-course',
          title: 'Admin Test Course',
          description: 'A test course',
          pricePaise: 100,
          format: 'SELF_PACED',
          level: 'BEGINNER',
          language: 'English',
        }
      });
      courseId = course.id;
    });

    afterAll(async () => {
      await prisma.lesson.deleteMany({});
      await prisma.courseModule.deleteMany({ where: { courseId } });
      await prisma.course.deleteMany({ where: { id: courseId } });
    });

    it('POST /admin/live-sessions by Instructor overrides instructorId', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/admin/live-sessions')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          title: 'Instructor 1 Session',
          courseId,
          schedule: new Date().toISOString(),
          instructorId: adminId, // Trying to assign to someone else
        });
      
      if (res.status !== 201) console.log(res.body);
      
      expect(res.status).toBe(201);
      expect(res.body.data.instructorId).toBe(instructorId); // overridden!
      sessionId = res.body.data.id;
    });

    it('PUT /admin/live-sessions/:id by different Instructor should fail (403)', async () => {
      await request(app.getHttpServer())
        .put(`/api/v1/admin/live-sessions/${sessionId}`)
        .set('Authorization', `Bearer ${instructor2Token}`)
        .send({ title: 'Hacked Session' })
        .expect(403);
    });

    it('PUT /admin/live-sessions/:id by same Instructor should succeed', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/v1/admin/live-sessions/${sessionId}`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({ title: 'Updated Session' })
        .expect(200);
      
      expect(res.body.data.title).toBe('Updated Session');
    });

    it('PUT /admin/live-sessions/:id by Admin should succeed', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/v1/admin/live-sessions/${sessionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Admin Updated Session' })
        .expect(200);
      
      expect(res.body.data.title).toBe('Admin Updated Session');
    });

    let webinarIdForPut: string;

    it('POST /admin/webinars by Instructor overrides instructorId', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/admin/webinars')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          title: 'Instructor 1 Webinar',
          schedule: new Date().toISOString(),
          instructorId: adminId, // Trying to assign to someone else
        });
      
      expect(res.status).toBe(201);
      expect(res.body.data.instructorId).toBe(instructorId); // overridden!
      webinarIdForPut = res.body.data.id;
    });

    it('PUT /admin/webinars/:id by different Instructor should fail (403)', async () => {
      await request(app.getHttpServer())
        .put(`/api/v1/admin/webinars/${webinarIdForPut}`)
        .set('Authorization', `Bearer ${instructor2Token}`)
        .send({ title: 'Hacked Webinar' })
        .expect(403);
    });

    it('PUT /admin/webinars/:id by same Instructor should succeed', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/v1/admin/webinars/${webinarIdForPut}`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({ title: 'Updated Webinar' })
        .expect(200);
      
      expect(res.body.data.title).toBe('Updated Webinar');
    });

    it('PUT /admin/webinars/:id by Admin should succeed', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/v1/admin/webinars/${webinarIdForPut}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Admin Updated Webinar' })
        .expect(200);
      
      expect(res.body.data.title).toBe('Admin Updated Webinar');
    });

    it('PUT /admin/webinars/:id should fail if trying to update a CLASS (type mismatch)', async () => {
      // sessionId is a CLASS
      await request(app.getHttpServer())
        .put(`/api/v1/admin/webinars/${sessionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Hacked Class to Webinar' })
        .expect(403);
    });

    it('PUT /admin/live-sessions/:id should fail if trying to update a WEBINAR (type mismatch)', async () => {
      // webinarIdForPut is a WEBINAR
      await request(app.getHttpServer())
        .put(`/api/v1/admin/live-sessions/${webinarIdForPut}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Hacked Webinar to Class' })
        .expect(403);
    });

    describe('Recording Attach & Module Creation', () => {
      it('POST /admin/live-sessions/:id/recording should attach URL and create a Lesson in the correct Module', async () => {
        const res = await request(app.getHttpServer())
          .post(`/api/v1/admin/live-sessions/${sessionId}/recording`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ url: 'https://s3.dummy/recording.mp4' })
          .expect(201);
        
        expect(res.body.data.recordingUrl).toBe('https://s3.dummy/recording.mp4');

        // Verify the Module and Lesson
        const modules = await prisma.courseModule.findMany({
          where: { courseId, title: 'Live Session Recordings' },
          include: { lessons: true }
        });
        expect(modules.length).toBe(1);
        expect(modules[0].lessons.length).toBe(1);
        expect(modules[0].lessons[0].videoUrl).toBe('https://s3.dummy/recording.mp4');

        // Add a second recording to ensure it appends rather than duplicating the module
        const session2 = await prisma.liveSession.create({
          data: {
            title: 'Second Session',
            type: 'CLASS',
            courseId,
            schedule: new Date().toISOString(),
            instructorId: adminId,
            status: 'COMPLETED'
          }
        });
        await request(app.getHttpServer())
          .post(`/api/v1/admin/live-sessions/${session2.id}/recording`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ url: 'https://s3.dummy/recording2.mp4' })
          .expect(201);

        const updatedModules = await prisma.courseModule.findMany({
          where: { courseId, title: 'Live Session Recordings' },
          include: { lessons: true }
        });
        expect(updatedModules.length).toBe(1); // Same module
        expect(updatedModules[0].lessons.length).toBe(2); // Two lessons now
      });
    });

    describe('Webinar Analytics', () => {
      let webinarId: string;
      beforeAll(async () => {
        const webinar = await prisma.liveSession.create({
          data: {
            title: 'Analytics Webinar',
            type: 'WEBINAR',
            schedule: new Date().toISOString(),
            instructorId: adminId,
            status: 'COMPLETED'
          }
        });
        webinarId = webinar.id;

        // Create some attendance records
        await prisma.attendance.createMany({
          data: [
            { liveSessionId: webinarId, registrationEmail: 'test1@example.com', registrationName: 'Test 1', registrationPhone: '111', joinTime: new Date() }, // attended
            { liveSessionId: webinarId, registrationEmail: 'test2@example.com', registrationName: 'Test 2', registrationPhone: '222' }, // registered, didn't attend
          ]
        });
      });

      it('GET /admin/webinars/:id/analytics should return calculated stats', async () => {
        const res = await request(app.getHttpServer())
          .get(`/api/v1/admin/webinars/${webinarId}/analytics`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);
        
        expect(res.body.data.totalRegistrations).toBe(2);
        expect(res.body.data.actualAttendance).toBe(1);
        expect(res.body.data.dropOffRate).toBe(50); // 50%
      });
    });
  });

  describe('Infrastructure Stubs (PDF & Storage)', () => {
    let pdfService: any;
    let storageService: any;
    
    beforeAll(() => {
      pdfService = app.get(PdfService);
      storageService = app.get(StorageService);
    });

    it('PdfService should generate and upload invoice', async () => {
      const url = await pdfService.generateAndUploadInvoice('test-order-123', {
        id: 'test-order-123',
        totalPaise: 5000,
        createdAt: new Date(),
        user: { email: 'test@example.com' }
      });
      expect(typeof url).toBe('string');
    });

    it('StorageService should upload buffer and return void or log in dev', async () => {
      const buffer = Buffer.from('dummy-pdf-content');
      await storageService.uploadFile('test-invoice.pdf', buffer, 'application/pdf');
    });
  });
});
