import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { AuthModule } from '../src/auth/auth.module.js';
import { PassportModule } from '@nestjs/passport';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor.js';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter.js';
import cookieParser from 'cookie-parser';
import { Redis } from 'ioredis';

import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../src/auth/guards/roles.guard.js';
import { Roles } from '../src/common/decorators/roles.decorator.js';

@Controller('test-rbac')
class TestRbacController {
  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAdminData() {
    return { secret: 'admin-data' };
  }
}

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: Redis;

  const testEmail = 'test@example.com';
  const testPassword = 'StrongPassword123!';
  let accessToken: string;
  let refreshTokenCookie: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [TestRbacController],
      providers: [JwtAuthGuard],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    redis = app.get<Redis>('REDIS_CLIENT');

    // Clean up before starting
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await redis.flushall();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await redis.flushall();
    await app.close();
  });

  it('/api/v1/auth/signup (POST) - fails with weak password', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send({ email: 'bad@example.com', password: '123' })
      .expect(400);

    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('/api/v1/auth/signup (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send({ email: testEmail, password: testPassword })
      .expect(201);

    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe(testEmail);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toContain('refreshToken=');

    accessToken = res.body.data.accessToken;
  });

  it('/api/v1/auth/signup (POST) - duplicate email', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send({ email: testEmail, password: testPassword })
      .expect(409);

    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('/api/v1/auth/login (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: testEmail, password: testPassword })
      .expect(200);

    expect(res.body.data.accessToken).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
    
    // Save the refresh token cookie string for subsequent tests
    const rawCookie = res.headers['set-cookie'][0];
    refreshTokenCookie = rawCookie.split(';')[0];
  });

  it('/api/v1/auth/login (POST) - fail invalid password', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: testEmail, password: 'wrong' })
      .expect(401);
  });

  it('JwtAuthGuard - fails with expired or invalid token', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/test-rbac/admin-only')
      .set('Authorization', 'Bearer invalid.token.here')
      .expect(401);
  });

  it('RolesGuard - learner fails to access admin-only route', async () => {
    // Current test user is a LEARNER (default role)
    await request(app.getHttpServer())
      .get('/api/v1/test-rbac/admin-only')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });

  it('/api/v1/auth/refresh (POST) - success rotation', async () => {
    // 1. Perform refresh with valid cookie
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .set('Cookie', refreshTokenCookie)
      .expect(200);

    expect(res.body.data.accessToken).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
    const newRawCookie = res.headers['set-cookie'][0];
    const newRefreshTokenCookie = newRawCookie.split(';')[0];
    expect(newRefreshTokenCookie).not.toBe(refreshTokenCookie);

    // 2. Perform refresh with OLD token (reuse detection)
    const resReuse = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .set('Cookie', refreshTokenCookie) // Sending old one
      .expect(401);

    expect(resReuse.body.error.message).toContain('Token reuse detected');
    
    // 3. The whole family should now be revoked. Try the new token that was issued.
    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .set('Cookie', newRefreshTokenCookie)
      .expect(401); // It should be invalid now!
  });

  it('/api/v1/auth/logout (POST) - success', async () => {
    // Let's login again to get a valid token
    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: testEmail, password: testPassword })
      .expect(200);

    const rawCookie = loginRes.headers['set-cookie'][0];
    const activeCookie = rawCookie.split(';')[0];

    // Now logout
    const logoutRes = await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Cookie', activeCookie)
      .expect(200);

    // Verify cookie cleared
    expect(logoutRes.headers['set-cookie'][0]).toContain('refreshToken=;');

    // Verify token is revoked
    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .set('Cookie', activeCookie)
      .expect(401);
  });

  it('/api/v1/auth/request-otp (POST) - success & throttle', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/request-otp')
      .send({ email: testEmail })
      .expect(200);

    const otp = await redis.get(`otp:${testEmail}`);
    expect(otp).toBeDefined();

    // Spam requests to trigger throttle (limit is 5 in 60s)
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .post('/api/v1/auth/request-otp')
        .send({ email: testEmail });
    }

    // Next request should hit 429 Too Many Requests
    await request(app.getHttpServer())
      .post('/api/v1/auth/request-otp')
      .send({ email: testEmail })
      .expect(429);
  });

  it('/api/v1/auth/login-otp (POST) - success', async () => {
    const otp = await redis.get(`otp:${testEmail}`);
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login-otp')
      .send({ email: testEmail, otp })
      .expect(200);
      
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('/api/v1/auth/forgot-password (POST) - anti-enumeration', async () => {
    // Should return 200 for BOTH existing and non-existing emails to prevent enumeration
    await request(app.getHttpServer())
      .post('/api/v1/auth/forgot-password')
      .send({ email: testEmail }) // existing
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'non-existent-user@example.com' }) // non-existing
      .expect(200);
  });

  it('/api/v1/auth/deactivate (POST) - success and login rejection', async () => {
    // Login to get token
    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: testEmail, password: testPassword })
      .expect(200);
      
    const token = loginRes.body.data.accessToken;

    // Deactivate
    await request(app.getHttpServer())
      .post('/api/v1/auth/deactivate')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
      
    // Verify user is deactivated
    const user = await prisma.user.findUnique({ where: { email: testEmail } });
    expect(user.isActive).toBe(false);

    // Try to login again
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: testEmail, password: testPassword })
      .expect(403);
      
    expect(res.body.error.message.toLowerCase()).toContain('deactivated');
  });
});
