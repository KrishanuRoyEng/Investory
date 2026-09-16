import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AgoraService, AgoraRole } from '../agora/agora.service.js';
import { v4 as uuidv4 } from 'uuid';
import { LiveSessionType, LiveSessionStatus, Role } from '@prisma/client';

@Injectable()
export class LiveSessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly agoraService: AgoraService,
  ) {}

  async registerForSession(userId: string, sessionId: string) {
    const session = await this.prisma.liveSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Live session not found');
    }

    if (session.type === 'CLASS' && session.courseId) {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: session.courseId } },
      });

      if (!enrollment) {
        throw new ForbiddenException('You must be enrolled in the course to register for this class');
      }
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const id = uuidv4();
    let insertedCount = 0;

    if (session.capacity === null) {
      // Uncapped session
      try {
        await this.prisma.attendance.create({
          data: { 
            id, 
            userId, 
            liveSessionId: sessionId,
            registrationName: user!.name,
            registrationEmail: user!.email,
            registrationPhone: user!.phone,
          },
        });
        insertedCount = 1;
      } catch (e: any) {
        if (e.code === 'P2002') {
          throw new ConflictException('Already registered for this session');
        }
        throw e;
      }
    } else {
      // Capped session - atomic conditional check
      try {
        insertedCount = await this.prisma.$executeRaw`
          INSERT INTO "Attendance" ("id", "userId", "liveSessionId", "registrationName", "registrationEmail", "registrationPhone")
          SELECT ${id}::text, ${userId}, ${sessionId}, ${user!.name}, ${user!.email}, ${user!.phone}
          WHERE (SELECT count(*) FROM "Attendance" WHERE "liveSessionId" = ${sessionId}) < ${session.capacity}
        `;
      } catch (e: any) {
        // Postgres unique violation code is 23505
        if (e.code === '23505' || (e.message && e.message.includes('unique constraint'))) {
          throw new ConflictException('Already registered for this session');
        }
        throw e;
      }
    }

    if (insertedCount === 0) {
      throw new ConflictException('Session capacity reached');
    }

    return { success: true, message: 'Successfully registered for the session' };
  }

  async getJoinDetails(userId: string, sessionId: string, userRole: Role) {
    const session = await this.prisma.liveSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Live session not found');
    }

    const attendance = await this.prisma.attendance.findFirst({
      where: { userId, liveSessionId: sessionId },
    });

    if (!attendance) {
      throw new ForbiddenException('You are not registered for this session');
    }

    const now = new Date().getTime();
    const scheduleTime = session.schedule.getTime();

    // 15 minutes before the scheduled time
    const windowStart = scheduleTime - 15 * 60 * 1000;
    // 4 hours after the scheduled time
    const windowEnd = scheduleTime + 4 * 60 * 60 * 1000;

    // Inclusive of exactly 15 minutes before (>=), exclusive of 4 hours after (<)
    if (now < windowStart || now >= windowEnd) {
      throw new ForbiddenException('Session is outside join time window');
    }

    const isInstructor = session.instructorId === userId;
    const isAdmin = userRole === Role.ADMIN;

    if (!isInstructor && !isAdmin && session.status !== 'IN_PROGRESS') {
      throw new ConflictException('Session has not been started by the instructor yet');
    }

    const role = (isInstructor || userRole === Role.ADMIN) ? AgoraRole.PUBLISHER : AgoraRole.SUBSCRIBER;
    
    // Tokens expire exactly at the end of the session window
    const expiryUnixSeconds = Math.floor(windowEnd / 1000);

    const { rtcToken, rtmToken } = this.agoraService.generateTokens(
      sessionId,
      userId,
      role,
      expiryUnixSeconds,
    );

    // Update joinTime if not already set
    if (!attendance.joinTime) {
      await this.prisma.attendance.update({
        where: { id: attendance.id },
        data: { joinTime: new Date() },
      });
    }

    return {
      rtcToken,
      rtmToken,
      channelName: sessionId,
      uid: userId,
      role,
      expiresAt: new Date(windowEnd).toISOString()
    };
  }

  async submitDoubt(userId: string, sessionId: string, question: string) {
    const session = await this.prisma.liveSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Live session not found');
    }

    const attendance = await this.prisma.attendance.findFirst({
      where: { userId, liveSessionId: sessionId },
    });

    if (!attendance) {
      throw new ForbiddenException('You must register for the session before submitting a doubt');
    }

    // Doubts can be submitted immediately after registration (pre-session queue)
    // No time-window enforcement required here per SRS.

    const doubt = await this.prisma.doubt.create({
      data: {
        userId,
        liveSessionId: sessionId,
        question,
      },
    });

    return doubt;
  }

  async findOne(sessionId: string) {
    return this.prisma.liveSession.findUnique({ where: { id: sessionId } });
  }

  async findOneAdmin(sessionId: string) {
    return this.prisma.liveSession.findFirst({
      where: { id: sessionId, type: LiveSessionType.CLASS },
    });
  }

  async findAllAdmin(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const [sessions, total] = await Promise.all([
      this.prisma.liveSession.findMany({
        where: { type: 'CLASS' },
        skip,
        take: pageSize,
        orderBy: { schedule: 'desc' },
        include: {
          instructor: { select: { name: true, email: true } },
          course: { select: { title: true, slug: true } },
          _count: { select: { attendances: true } },
        },
      }),
      this.prisma.liveSession.count({ where: { type: 'CLASS' } }),
    ]);
    return { data: sessions, meta: { total, page, pageSize } };
  }

  async createLiveSession(data: any) {
    return this.prisma.liveSession.create({
      data: {
        title: data.title,
        courseId: data.courseId,
        schedule: new Date(data.schedule),
        instructorId: data.instructorId,
        capacity: data.capacity,
        type: 'CLASS',
      },
    });
  }

  async updateLiveSession(sessionId: string, data: any) {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.courseId !== undefined) updateData.courseId = data.courseId;
    if (data.schedule !== undefined) updateData.schedule = new Date(data.schedule);
    if (data.instructorId !== undefined) updateData.instructorId = data.instructorId;
    if (data.capacity !== undefined) updateData.capacity = data.capacity;

    return this.prisma.liveSession.update({
      where: { id: sessionId },
      data: updateData,
    });
  }

  async updateStatus(id: string, status: LiveSessionStatus) {
    return this.prisma.liveSession.update({
      where: { id },
      data: { status }
    });
  }

  async attachRecording(id: string, url: string) {
    const session = await this.prisma.liveSession.update({
      where: { id },
      data: { recordingUrl: url }
    });

    if (session.courseId) {
      await this.prisma.lesson.create({
        data: {
          title: `Recording: ${session.title}`,
          videoUrl: url,
          order: 999, // Append to the end
          moduleId: await this.getOrCreateModuleForCourse(session.courseId),
        }
      });
    }

    return session;
  }

  private async getOrCreateModuleForCourse(courseId: string) {
    let module = await this.prisma.courseModule.findFirst({
      where: { courseId, title: 'Live Session Recordings' },
    });

    if (!module) {
      // Find the last order to append after it
      const lastModule = await this.prisma.courseModule.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' }
      });
      const nextOrder = lastModule ? lastModule.order + 1 : 1;

      module = await this.prisma.courseModule.create({
        data: {
          title: 'Live Session Recordings',
          order: nextOrder,
          courseId,
        }
      });
    }
    return module.id;
  }
}
