import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { Role, CourseFormat, CourseLevel, CourseStatus, LiveSessionType } from '@prisma/client';
import { AgoraService } from '../src/agora/agora.service.js';
import { vi } from 'vitest';

describe('LiveSessionsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let agoraService: AgoraService;
  
  let learnerToken: string;
  let learnerToken2: string;
  let instructorToken: string;
  
  let learnerId: string;
  let learnerId2: string;
  let instructorId: string;
  
  let courseId: string;
  let activeSessionId: string;
  let futureSessionId: string;
  let cappedSessionId: string;

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

    // Mock Agora Service to avoid requiring real credentials
    vi.spyOn(agoraService, 'generateTokens').mockImplementation((channel, uid, role, expiry) => ({
      rtcToken: `mock-rtc-${channel}-${uid}-${role}-${expiry}`,
      rtmToken: `mock-rtm-${uid}-${expiry}`,
    }));

    // Clean up
    await prisma.doubt.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.liveSession.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    const user1 = await prisma.user.create({ data: { email: 'ls-learner1@example.com', password: 'hash', role: Role.LEARNER } });
    const user2 = await prisma.user.create({ data: { email: 'ls-learner2@example.com', password: 'hash', role: Role.LEARNER } });
    const user3 = await prisma.user.create({ data: { email: 'ls-instructor@example.com', password: 'hash', role: Role.INSTRUCTOR } });
    
    learnerId = user1.id;
    learnerId2 = user2.id;
    instructorId = user3.id;

    // Create tokens
    const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
    learnerToken = jwtService.sign({ sub: learnerId, email: user1.email, role: user1.role }, { secret });
    learnerToken2 = jwtService.sign({ sub: learnerId2, email: user2.email, role: user2.role }, { secret });
    instructorToken = jwtService.sign({ sub: instructorId, email: user3.email, role: user3.role }, { secret });

    // Create Course
    const course = await prisma.course.create({
      data: {
        slug: 'live-class-course',
        title: 'Live Class Course',
        description: 'Test',
        pricePaise: 1000,
        format: CourseFormat.LIVE,
        level: CourseLevel.BEGINNER,
        status: CourseStatus.PUBLISHED,
        language: 'English',
      }
    });
    courseId = course.id;

    // Enroll learner 1 only
    await prisma.enrollment.create({
      data: { userId: learnerId, courseId: course.id }
    });

    const now = new Date();

    // Session 1: Active now (schedule is 10 mins ago)
    const activeSession = await prisma.liveSession.create({
      data: {
        title: 'Active Session',
        type: LiveSessionType.CLASS,
        schedule: new Date(now.getTime() - 10 * 60 * 1000), 
        instructorId,
        courseId: course.id,
      }
    });
    activeSessionId = activeSession.id;

    // Session 2: Future session (starts in exactly 15 minutes boundary)
    const futureSession = await prisma.liveSession.create({
      data: {
        title: 'Future Session',
        type: LiveSessionType.CLASS,
        schedule: new Date(now.getTime() + 15 * 60 * 1000), 
        instructorId,
        courseId: course.id,
      }
    });
    futureSessionId = futureSession.id;

    // Session 3: Capped session (capacity = 1)
    const cappedSession = await prisma.liveSession.create({
      data: {
        title: 'Capped Session',
        type: LiveSessionType.CLASS,
        schedule: new Date(now.getTime() + 20 * 60 * 1000), 
        capacity: 1,
        instructorId,
        courseId: course.id,
      }
    });
    cappedSessionId = cappedSession.id;
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

  it('POST /live-sessions/:id/register should block un-enrolled learner', async () => {
    const res = await request(app.getHttpServer())
      .post(`/live-sessions/${activeSessionId}/register`)
      .set('Authorization', `Bearer ${learnerToken2}`);
    expect(res.status).toBe(403);
  });

  it('POST /live-sessions/:id/register should allow enrolled learner to register for uncapped session', async () => {
    const res = await request(app.getHttpServer())
      .post(`/live-sessions/${activeSessionId}/register`)
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(res.status).toBe(201);
  });

  it('POST /live-sessions/:id/register should block duplicate registration', async () => {
    const res = await request(app.getHttpServer())
      .post(`/live-sessions/${activeSessionId}/register`)
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(res.status).toBe(409); // ConflictException
  });

  it('POST /live-sessions/:id/register should enforce capacity cap (1 max)', async () => {
    // Enroll learner 2 to bypass enrollment check for this course
    await prisma.enrollment.create({
      data: { userId: learnerId2, courseId }
    });

    // Learner 1 registers successfully
    const res1 = await request(app.getHttpServer())
      .post(`/live-sessions/${cappedSessionId}/register`)
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(res1.status).toBe(201);

    // Learner 2 registers and gets blocked by executeRaw cap
    const res2 = await request(app.getHttpServer())
      .post(`/live-sessions/${cappedSessionId}/register`)
      .set('Authorization', `Bearer ${learnerToken2}`);
    expect(res2.status).toBe(409);
    expect(res2.body.message).toBe('Session capacity reached');
  });

  it('GET /live-sessions/:id/join should return 200 at EXACTLY the 15-minute boundary (inclusive)', async () => {
    vi.useFakeTimers();
    const mockNow = new Date('2026-01-01T10:00:00.000Z');
    vi.setSystemTime(mockNow);
    
    const scheduleDate = new Date(mockNow.getTime() + 15 * 60 * 1000);
    const boundarySession = await prisma.liveSession.create({
      data: {
        title: 'Boundary Session',
        type: LiveSessionType.CLASS,
        status: 'IN_PROGRESS',
        schedule: new Date(mockNow.getTime() + 15 * 60 * 1000), 
        instructorId,
        courseId,
      }
    });

    await request(app.getHttpServer())
      .post(`/live-sessions/${boundarySession.id}/register`)
      .set('Authorization', `Bearer ${learnerToken}`);

    const res = await request(app.getHttpServer())
      .get(`/live-sessions/${boundarySession.id}/join`)
      .set('Authorization', `Bearer ${learnerToken}`);
    
    if (res.status !== 200) console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.rtcToken).toContain('mock-rtc-');
    
    vi.useRealTimers();
  });

  it('GET /live-sessions/:id/join should return 403 exactly 1 millisecond before the 15-minute boundary', async () => {
    vi.useFakeTimers();
    const mockNow = new Date('2026-01-01T10:00:00.000Z');
    vi.setSystemTime(mockNow);

    const tooFarFutureSession = await prisma.liveSession.create({
      data: {
        title: 'Too Far Future',
        type: LiveSessionType.CLASS,
        // Schedule is 15 minutes + 1 millisecond from now
        schedule: new Date(mockNow.getTime() + 15 * 60 * 1000 + 1), 
        instructorId,
        courseId,
      }
    });

    await request(app.getHttpServer())
      .post(`/live-sessions/${tooFarFutureSession.id}/register`)
      .set('Authorization', `Bearer ${learnerToken}`);

    const res = await request(app.getHttpServer())
      .get(`/live-sessions/${tooFarFutureSession.id}/join`)
      .set('Authorization', `Bearer ${learnerToken}`);
    
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Session is outside join time window');
    
    vi.useRealTimers();
  });

  it('POST /live-sessions/:id/doubts should allow pre-session submission immediately after registration', async () => {
    // Register first
    await request(app.getHttpServer())
      .post(`/live-sessions/${futureSessionId}/register`)
      .set('Authorization', `Bearer ${learnerToken}`);

    const res = await request(app.getHttpServer())
      .post(`/live-sessions/${futureSessionId}/doubts`)
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ question: 'Will this be recorded?' });

    expect(res.status).toBe(201);
    expect(res.body.data.question).toBe('Will this be recorded?');
  });
});
