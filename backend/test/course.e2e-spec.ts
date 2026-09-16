import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor.js';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter.js';
import cookieParser from 'cookie-parser';
import { Redis } from 'ioredis';
import { Role, CourseFormat, CourseLevel, CourseStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

describe('CourseController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: Redis;
  let jwtService: JwtService;

  let adminToken: string;
  let learnerToken: string;
  let adminId: string;
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
    // Hardcode redis port to avoid issues if needed, but it should connect via env
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

    // Create Admin and Learner
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin-course@example.com',
        password: 'hash',
        role: Role.ADMIN,
      }
    });
    adminId = adminUser.id;
    adminToken = jwtService.sign({ sub: adminUser.id, email: adminUser.email, role: adminUser.role }, { secret: process.env.JWT_SECRET || 'fallback-secret-for-dev' });

    const learnerUser = await prisma.user.create({
      data: {
        email: 'learner-course@example.com',
        password: 'hash',
        role: Role.LEARNER,
      }
    });
    learnerId = learnerUser.id;
    learnerToken = jwtService.sign({ sub: learnerUser.id, email: learnerUser.email, role: learnerUser.role }, { secret: process.env.JWT_SECRET || 'fallback-secret-for-dev' });
  });

  afterAll(async () => {
    await prisma.lesson.deleteMany({});
    await prisma.courseModule.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.user.deleteMany({ where: { email: { in: ['admin-course@example.com', 'learner-course@example.com'] } } });
    await redis.quit();
    await app.close();
  });

  describe('Admin Course Creation', () => {
    it('should allow admin to create a course', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          slug: 'test-course-1',
          title: 'Test Course 1',
          description: 'A test course',
          pricePaise: 10000,
          format: CourseFormat.SELF_PACED,
          level: CourseLevel.BEGINNER,
          language: 'English',
        })
        .expect(201);

      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.slug).toBe('test-course-1');
      expect(res.body.data.status).toBe(CourseStatus.DRAFT);
    });

    it('should throw 409 Conflict for duplicate slug', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          slug: 'test-course-1', // duplicate
          title: 'Duplicate Slug Course',
          description: 'A test course',
          pricePaise: 10000,
          format: CourseFormat.SELF_PACED,
          level: CourseLevel.BEGINNER,
          language: 'English',
        })
        .expect(409);
    });

    it('should forbid learner from creating a course', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/admin/courses')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          slug: 'learner-course',
          title: 'Learner Course',
          description: 'A test course',
          pricePaise: 10000,
          format: CourseFormat.SELF_PACED,
          level: CourseLevel.BEGINNER,
          language: 'English',
        })
        .expect(403);
    });
  });

  describe('Catalogue Listing & Detail', () => {
    let publishedCourseId: string;
    let draftCourseId: string;

    beforeAll(async () => {
      const draft = await prisma.course.create({
        data: {
          slug: 'draft-course',
          title: 'Draft Course',
          description: 'Draft',
          pricePaise: 0,
          format: CourseFormat.LIVE,
          level: CourseLevel.ADVANCED,
          language: 'Spanish',
          status: CourseStatus.DRAFT,
        }
      });
      draftCourseId = draft.id;

      const published = await prisma.course.create({
        data: {
          slug: 'published-course',
          title: 'Published Course',
          description: 'Awesome contents here',
          pricePaise: 5000,
          format: CourseFormat.SELF_PACED,
          level: CourseLevel.INTERMEDIATE,
          language: 'English',
          status: CourseStatus.PUBLISHED,
        }
      });
      publishedCourseId = published.id;

      const mod = await prisma.courseModule.create({
        data: { courseId: published.id, title: 'Module 1', order: 1 }
      });
      await prisma.lesson.create({
        data: { moduleId: mod.id, title: 'Lesson 1', videoUrl: 'http://example.com/vid', order: 1 }
      });
    });

    it('GET /courses (Public) should only return PUBLISHED courses', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/courses')
        .expect(200);

      const courses = res.body.data;
      expect(courses.some((c: any) => c.slug === 'published-course')).toBe(true);
      expect(courses.some((c: any) => c.slug === 'draft-course')).toBe(false);
      expect(courses.some((c: any) => c.slug === 'test-course-1')).toBe(false); // it was DRAFT
    });

    it('GET /courses (Admin) should return all courses', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const courses = res.body.data;
      expect(courses.some((c: any) => c.slug === 'published-course')).toBe(true);
      expect(courses.some((c: any) => c.slug === 'draft-course')).toBe(true);
    });

    it('GET /courses?q=Awesome (Public) filters by ILIKE search', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/courses?q=awesome')
        .expect(200);

      const courses = res.body.data;
      expect(courses.length).toBe(1);
      expect(courses[0].slug).toBe('published-course');
    });

    it('GET /courses/:slug (Public) redacts videoUrl', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/courses/published-course')
        .expect(200);

      const course = res.body.data;
      expect(course.slug).toBe('published-course');
      expect(course.modules[0].lessons[0]).toHaveProperty('title', 'Lesson 1');
      expect(course.modules[0].lessons[0]).not.toHaveProperty('videoUrl');
    });

    it('GET /courses/:slug (Learner) redacts videoUrl', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/courses/published-course')
        .set('Authorization', `Bearer ${learnerToken}`)
        .expect(200);

      const course = res.body.data;
      expect(course.modules[0].lessons[0]).toHaveProperty('title', 'Lesson 1');
      expect(course.modules[0].lessons[0]).not.toHaveProperty('videoUrl');
    });

    it('GET /courses/:slug (Admin) includes videoUrl', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/courses/published-course')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const course = res.body.data;
      expect(course.modules[0].lessons[0]).toHaveProperty('videoUrl', 'http://example.com/vid');
    });

    it('GET /courses/:slug (Public) returns 404 for DRAFT course', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/courses/draft-course')
        .expect(404);
    });
  });
});
