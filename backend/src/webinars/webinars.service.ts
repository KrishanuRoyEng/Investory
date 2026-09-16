import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterWebinarDto } from './dto/register-webinar.dto.js';
import { AgoraService, AgoraRole } from '../agora/agora.service.js';
import { v4 as uuidv4 } from 'uuid';
import { LiveSessionType, LiveSessionStatus, Role } from '@prisma/client';

@Injectable()
export class WebinarsService {
  constructor(private readonly prisma: PrismaService, private readonly agoraService: AgoraService) {}

  async findAll(userId?: string) {
    if (userId) {
      const enrollments = await this.prisma.enrollment.findMany({ where: { userId }, select: { courseId: true } });
      const courseIds = enrollments.map(e => e.courseId);
      
      return this.prisma.liveSession.findMany({
        where: {
          type: LiveSessionType.WEBINAR,
          OR: [
            { courseId: null },
            { courseId: { in: courseIds } }
          ]
        },
        orderBy: { schedule: 'asc' }
      });
    } else {
      return this.prisma.liveSession.findMany({
        where: { type: LiveSessionType.WEBINAR, courseId: null },
        orderBy: { schedule: 'asc' }
      });
    }
  }

  async findOne(sessionId: string, userId?: string) {
    const session = await this.prisma.liveSession.findUnique({ where: { id: sessionId, type: LiveSessionType.WEBINAR } });
    if (!session) throw new NotFoundException('Webinar not found');

    if (session.courseId) {
      if (!userId) throw new ForbiddenException('You must be logged in to access this exclusive webinar');
      const enrollment = await this.prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: session.courseId } }
      });
      if (!enrollment) throw new ForbiddenException('You must be enrolled in the course to access this webinar');
    }
    
    return session;
  }

  /** Admin-only: find webinar by ID without userId enrollment check, but still type-filtered */
  async findOneAdmin(sessionId: string) {
    return this.prisma.liveSession.findFirst({
      where: { id: sessionId, type: LiveSessionType.WEBINAR },
    });
  }

  async findAllAdmin(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const [webinars, total] = await Promise.all([
      this.prisma.liveSession.findMany({
        where: { type: LiveSessionType.WEBINAR },
        skip,
        take: pageSize,
        orderBy: { schedule: 'desc' },
        include: {
          instructor: { select: { name: true, email: true } },
          course: { select: { title: true, slug: true } },
          _count: { select: { attendances: true } },
        },
      }),
      this.prisma.liveSession.count({ where: { type: LiveSessionType.WEBINAR } }),
    ]);
    return { data: webinars, meta: { total, page, pageSize } };
  }

  async createWebinar(data: any) {
    return this.prisma.liveSession.create({
      data: {
        title: data.title,
        courseId: data.courseId,
        schedule: new Date(data.schedule),
        instructorId: data.instructorId,
        capacity: data.capacity,
        type: 'WEBINAR',
      },
    });
  }

  async updateWebinar(sessionId: string, data: any) {
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

  async attachRecording(id: string, url: string) {
    return this.prisma.liveSession.update({
      where: { id },
      data: { recordingUrl: url }
    });
  }

  async getAnalytics(id: string) {
    const session = await this.prisma.liveSession.findUnique({
      where: { id },
      include: {
        attendances: true
      }
    });

    if (!session) {
      throw new NotFoundException('Webinar not found');
    }

    const totalRegistrations = session.attendances.length;
    const actualAttendance = session.attendances.filter(a => a.joinTime !== null).length;
    const dropOffRate = totalRegistrations > 0 ? ((totalRegistrations - actualAttendance) / totalRegistrations) * 100 : 0;
    const conversionTracking = actualAttendance;

    return {
      totalRegistrations,
      actualAttendance,
      dropOffRate,
      conversionTracking,
    };
  }

  async registerForWebinar(sessionId: string, dto: RegisterWebinarDto, userId?: string) {
    const session = await this.findOne(sessionId, userId);

    const id = uuidv4();
    let insertedCount = 0;
    
    if (session.capacity === null) {
      try {
        await this.prisma.attendance.create({
          data: {
            id,
            userId: userId || null,
            liveSessionId: sessionId,
            registrationName: dto.name,
            registrationEmail: dto.email,
            registrationPhone: dto.phone,
          }
        });
        insertedCount = 1;
      } catch (e: any) {
        if (e.code === 'P2002') throw new ConflictException('Already registered for this webinar');
        throw e;
      }
    } else {
      try {
        const uId = userId || null;
        const phone = dto.phone || null;
        insertedCount = await this.prisma.$executeRaw`
          INSERT INTO "Attendance" ("id", "userId", "liveSessionId", "registrationName", "registrationEmail", "registrationPhone")
          SELECT ${id}::text, ${uId}, ${sessionId}, ${dto.name}, ${dto.email}, ${phone}
          WHERE (SELECT count(*) FROM "Attendance" WHERE "liveSessionId" = ${sessionId}) < ${session.capacity}
        `;
      } catch (e: any) {
        if (e.code === '23505' || (e.message && e.message.includes('unique constraint'))) {
          throw new ConflictException('Already registered for this webinar');
        }
        throw e;
      }
    }

    if (insertedCount === 0) {
      throw new ConflictException('Webinar capacity reached');
    }

    return { success: true, attendanceId: id };
  }

  async getJoinDetails(sessionId: string, ticketId?: string, userId?: string, userRole?: Role) {
    const session = await this.findOne(sessionId, userId);
    
    let attendance;
    
    if (ticketId) {
       attendance = await this.prisma.attendance.findFirst({ where: { id: ticketId, liveSessionId: sessionId } });
       if (attendance && attendance.userId && attendance.userId !== userId) {
         throw new ForbiddenException('Invalid ticket for current user');
       }
    } else if (userId) {
       attendance = await this.prisma.attendance.findFirst({ where: { userId, liveSessionId: sessionId } });
    }

    if (!attendance) {
      throw new ForbiddenException('You are not registered for this webinar');
    }

    const now = new Date().getTime();
    const scheduleTime = session.schedule.getTime();

    const windowStart = scheduleTime - 15 * 60 * 1000;
    const windowEnd = scheduleTime + 4 * 60 * 60 * 1000;

    if (now < windowStart || now >= windowEnd) {
      throw new ForbiddenException('Webinar is outside join time window');
    }

    const isInstructor = userId && session.instructorId === userId;
    const isAdmin = userRole === Role.ADMIN;

    if (!isInstructor && !isAdmin && session.status !== 'IN_PROGRESS') {
      throw new ConflictException('Webinar has not been started by the instructor yet');
    }

    const role = (isInstructor || userRole === Role.ADMIN) ? AgoraRole.PUBLISHER : AgoraRole.SUBSCRIBER;
    
    const expiryUnixSeconds = Math.floor(windowEnd / 1000);
    
    const uid = userId || attendance.id;

    const { rtcToken, rtmToken } = this.agoraService.generateTokens(
      sessionId,
      uid,
      role,
      expiryUnixSeconds,
    );

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
      uid,
      role,
      expiresAt: new Date(windowEnd).toISOString()
    };
  }
}
