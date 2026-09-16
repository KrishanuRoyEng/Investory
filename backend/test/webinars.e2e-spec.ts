import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { Role, CourseFormat, CourseLevel, CourseStatus, LiveSessionType } from '@prisma/client';
import { AgoraService } from '../src/agora/agora.service.js';
import { vi } from 'vitest';

describe('WebinarsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let agoraService: AgoraService;
  
  let learnerToken: string;
  let instructorToken: string;
  
  let learnerId: string;
  let instructorId: string;
  
  let courseId: string;
  let publicWebinarId: string;
  let exclusiveWebinarId: string;
  let cappedPublicWebinarId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);
    agoraService = app.get<AgoraService>(AgoraService);

    vi.spyOn(agoraService, 'generateTokens').mockImplementation((channel, uid, role, expiry) => ({
      rtcToken: `mock-rtc-${channel}-${uid}-${role}-${expiry}`,
      rtmToken: `mock-rtm-${uid}-${expiry}`,
    }));

    await prisma.doubt.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.liveSession.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    const user1 = await prisma.user.create({ data: { email: 'web-learner1@example.com', password: 'hash', role: Role.LEARNER, name: 'Web Learner' } });
    const user3 = await prisma.user.create({ data: { email: 'web-instructor@example.com', password: 'hash', role: Role.INSTRUCTOR, name: 'Instructor' } });
    
    learnerId = user1.id;
    instructorId = user3.id;

    const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
    learnerToken = jwtService.sign({ sub: learnerId, email: user1.email, role: user1.role, userId: learnerId }, { secret });
    instructorToken = jwtService.sign({ sub: instructorId, email: user3.email, role: user3.role, userId: instructorId }, { secret });

    const course = await prisma.course.create({
      data: {
        slug: 'webinar-course',
        title: 'Webinar Course',
        description: 'Test',
        pricePaise: 1000,
        format: CourseFormat.LIVE,
        level: CourseLevel.BEGINNER,
        status: CourseStatus.PUBLISHED,
        language: 'English',
      }
    });
    courseId = course.id;

    await prisma.enrollment.create({
      data: { userId: learnerId, courseId: course.id }
    });

    const now = new Date();

    const publicWebinar = await prisma.liveSession.create({
      data: {
        title: 'Public Webinar',
        type: LiveSessionType.WEBINAR,
        schedule: new Date(now.getTime() - 10 * 60 * 1000), 
        instructorId,
        courseId: null, // Public
      }
    });
    publicWebinarId = publicWebinar.id;

    const exclusiveWebinar = await prisma.liveSession.create({
      data: {
        title: 'Exclusive Webinar',
        type: LiveSessionType.WEBINAR,
        schedule: new Date(now.getTime() + 15 * 60 * 1000), 
        instructorId,
        courseId: course.id, // Exclusive
      }
    });
    exclusiveWebinarId = exclusiveWebinar.id;

    const cappedPublicWebinar = await prisma.liveSession.create({
      data: {
        title: 'Capped Public Webinar',
        type: LiveSessionType.WEBINAR,
        schedule: new Date(now.getTime() + 20 * 60 * 1000), 
        capacity: 1,
        instructorId,
        courseId: null,
      }
    });
    cappedPublicWebinarId = cappedPublicWebinar.id;
  });

  afterAll(async () => {
    await prisma.doubt.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.liveSession.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('GET /webinars should return public webinars for guests', async () => {
    const res = await request(app.getHttpServer()).get('/webinars');
    expect(res.status).toBe(200);
    const ids = res.body.data.map(w => w.id);
    expect(ids).toContain(publicWebinarId);
    expect(ids).not.toContain(exclusiveWebinarId);
  });

  it('GET /webinars should return exclusive webinars for enrolled learners', async () => {
    const res = await request(app.getHttpServer())
      .get('/webinars')
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(res.status).toBe(200);
    const ids = res.body.data.map(w => w.id);
    expect(ids).toContain(publicWebinarId);
    expect(ids).toContain(exclusiveWebinarId);
  });

  it('POST /webinars/:id/register should block unauthenticated request for exclusive webinar', async () => {
    const res = await request(app.getHttpServer())
      .post(`/webinars/${exclusiveWebinarId}/register`)
      .send({ name: 'Guest', email: 'guest@example.com' });
    expect(res.status).toBe(403);
  });

  let guestTicketId: string;

  it('POST /webinars/:id/register should allow guest registration for public webinar', async () => {
    const res = await request(app.getHttpServer())
      .post(`/webinars/${publicWebinarId}/register`)
      .send({ name: 'Guest User', email: 'guestuser@example.com', phone: '1234567890' });
    
    expect(res.status).toBe(201);
    expect(res.body.data.success).toBe(true);
    expect(res.body.data.attendanceId).toBeDefined();
    guestTicketId = res.body.data.attendanceId;

    // Verify DB
    const attendance = await prisma.attendance.findUnique({ where: { id: guestTicketId } });
    expect(attendance.userId).toBeNull();
    expect(attendance.registrationName).toBe('Guest User');
    expect(attendance.registrationEmail).toBe('guestuser@example.com');
  });

  it('POST /webinars/:id/register should allow multiple DIFFERENT guests to register for the same uncapped public webinar (NULL uniqueness check)', async () => {
    // Guest 1
    const res1 = await request(app.getHttpServer())
      .post(`/webinars/${publicWebinarId}/register`)
      .send({ name: 'Different Guest 1', email: 'diff1@example.com' });
    expect(res1.status).toBe(201);

    // Guest 2
    const res2 = await request(app.getHttpServer())
      .post(`/webinars/${publicWebinarId}/register`)
      .send({ name: 'Different Guest 2', email: 'diff2@example.com' });
    expect(res2.status).toBe(201);

    // Same Guest 1 again (should fail)
    const res3 = await request(app.getHttpServer())
      .post(`/webinars/${publicWebinarId}/register`)
      .send({ name: 'Different Guest 1', email: 'diff1@example.com' });
    expect(res3.status).toBe(409);
  });

  it('GET /webinars/:id/join should allow guest to join with ticketId', async () => {
    // First, set the session status to IN_PROGRESS so the learner can join
    await prisma.liveSession.update({
      where: { id: publicWebinarId },
      data: { status: 'IN_PROGRESS' }
    });

    const res = await request(app.getHttpServer())
      .get(`/webinars/${publicWebinarId}/join?ticketId=${guestTicketId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.rtcToken).toBeDefined();
    expect(res.body.data.uid).toBe(guestTicketId);
  });

  it('POST /webinars/:id/register should enforce capacity limit for public webinars', async () => {
    // Register 1
    const res1 = await request(app.getHttpServer())
      .post(`/webinars/${cappedPublicWebinarId}/register`)
      .send({ name: 'Guest 1', email: 'guest1@example.com' });
    expect(res1.status).toBe(201);

    // Register 2 (should fail)
    const res2 = await request(app.getHttpServer())
      .post(`/webinars/${cappedPublicWebinarId}/register`)
      .send({ name: 'Guest 2', email: 'guest2@example.com' });
    expect(res2.status).toBe(409);
    expect(res2.body.message).toBe('Webinar capacity reached');
  });

  it('GET /webinars/:id/join should strictly enforce the 15-minute time window (exclusive test)', async () => {
    // 1. Learner registers for exclusive webinar
    await request(app.getHttpServer())
      .post(`/webinars/${exclusiveWebinarId}/register`)
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ name: 'Learner', email: 'web-learner1@example.com' });

    vi.useFakeTimers();
    const mockNow = new Date('2026-01-01T10:00:00.000Z');
    vi.setSystemTime(mockNow);

    const boundaryWebinar = await prisma.liveSession.create({
      data: {
        title: 'Boundary Webinar',
        type: LiveSessionType.WEBINAR,
        schedule: new Date(mockNow.getTime() + 15 * 60 * 1000 + 1), // 1ms before 15m window
        instructorId,
        courseId: courseId,
      }
    });

    await request(app.getHttpServer())
      .post(`/webinars/${boundaryWebinar.id}/register`)
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ name: 'Learner', email: 'web-learner1@example.com' });

    const res = await request(app.getHttpServer())
      .get(`/webinars/${boundaryWebinar.id}/join`)
      .set('Authorization', `Bearer ${learnerToken}`);
    
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Webinar is outside join time window');

    vi.useRealTimers();
  });
});
