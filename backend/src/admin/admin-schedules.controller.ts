import { Controller, Get, Post, Put, Body, Param, Req, Query, ForbiddenException } from '@nestjs/common';
import { LiveSessionsService } from '../live-sessions/live-sessions.service.js';
import { WebinarsService } from '../webinars/webinars.service.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '@prisma/client';
import type { Request } from 'express';
import { IsString, IsOptional, IsDateString, IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateLiveSessionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  courseId?: string;

  @IsDateString()
  schedule: string;

  @IsString()
  @IsOptional()
  instructorId?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;
}

export class UpdateLiveSessionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  courseId?: string;

  @IsDateString()
  @IsOptional()
  schedule?: string;

  @IsString()
  @IsOptional()
  instructorId?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;
}

export class CreateWebinarDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  courseId?: string;

  @IsDateString()
  schedule: string;

  @IsString()
  @IsOptional()
  instructorId?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;
}

export class UpdateWebinarDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  courseId?: string;

  @IsDateString()
  @IsOptional()
  schedule?: string;

  @IsString()
  @IsOptional()
  instructorId?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;
}

export class RecordingDto {
  @IsString()
  @IsNotEmpty()
  url: string;
}

@Controller('admin')
@Roles(Role.ADMIN, Role.INSTRUCTOR)
export class AdminSchedulesController {
  constructor(
    private readonly liveSessionsService: LiveSessionsService,
    private readonly webinarsService: WebinarsService,
  ) {}

  // ---- Live Sessions ----

  @Get('live-sessions')
  async findAllLiveSessions(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const ps = pageSize ? parseInt(pageSize, 10) : 20;
    return this.liveSessionsService.findAllAdmin(p, ps);
  }

  @Post('live-sessions')
  async createLiveSession(@Body() dto: CreateLiveSessionDto, @Req() req: Request) {
    const user = req.user as any;
    if (user.role === Role.INSTRUCTOR) {
      dto.instructorId = user.userId; // Override
    }
    return this.liveSessionsService.createLiveSession(dto);
  }

  @Put('live-sessions/:id')
  async updateLiveSession(@Param('id') id: string, @Body() dto: UpdateLiveSessionDto, @Req() req: Request) {
    const user = req.user as any;
    const session = await this.liveSessionsService.findOneAdmin(id);
    if (!session) throw new ForbiddenException('Session not found');

    if (user.role === Role.INSTRUCTOR) {
      if (session.instructorId !== user.userId) {
        throw new ForbiddenException("Cannot edit another instructor's session");
      }
      if (dto.instructorId) {
        dto.instructorId = user.userId; // Prevent reassignment
      }
    }
    return this.liveSessionsService.updateLiveSession(id, dto);
  }

  @Post('live-sessions/:id/start')
  async startLiveSession(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    await this.verifySessionOwnership(id, user.userId, user.role);
    return this.liveSessionsService.updateStatus(id, 'IN_PROGRESS');
  }

  @Post('live-sessions/:id/end')
  async endLiveSession(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    await this.verifySessionOwnership(id, user.userId, user.role);
    return this.liveSessionsService.updateStatus(id, 'COMPLETED');
  }

  @Post('live-sessions/:id/recording')
  async attachRecording(@Param('id') id: string, @Body() dto: RecordingDto, @Req() req: Request) {
    const user = req.user as any;
    await this.verifySessionOwnership(id, user.userId, user.role);
    return this.liveSessionsService.attachRecording(id, dto.url);
  }

  private async verifySessionOwnership(sessionId: string, userId: string, role: Role) {
    const session = await this.liveSessionsService.findOneAdmin(sessionId);
    if (!session) throw new ForbiddenException('Session not found');
    if (role === Role.INSTRUCTOR && session.instructorId !== userId) {
      throw new ForbiddenException("Cannot modify another instructor's session");
    }
    return session;
  }

  // ---- Webinars ----

  @Get('webinars')
  async findAllWebinars(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const ps = pageSize ? parseInt(pageSize, 10) : 20;
    return this.webinarsService.findAllAdmin(p, ps);
  }

  @Post('webinars')
  async createWebinar(@Body() dto: CreateWebinarDto, @Req() req: Request) {
    const user = req.user as any;
    if (user.role === Role.INSTRUCTOR) {
      dto.instructorId = user.userId; // Override
    }
    return this.webinarsService.createWebinar(dto);
  }

  @Put('webinars/:id')
  async updateWebinar(@Param('id') id: string, @Body() dto: UpdateWebinarDto, @Req() req: Request) {
    const user = req.user as any;
    // FIX: Use webinarsService.findOneAdmin (type-filtered) instead of liveSessionsService.findOne
    const webinar = await this.webinarsService.findOneAdmin(id);
    if (!webinar) throw new ForbiddenException('Webinar not found');

    if (user.role === Role.INSTRUCTOR) {
      if (webinar.instructorId !== user.userId) {
        throw new ForbiddenException("Cannot edit another instructor's webinar");
      }
      if (dto.instructorId) {
        dto.instructorId = user.userId; // Prevent reassignment
      }
    }
    return this.webinarsService.updateWebinar(id, dto);
  }

  @Post('webinars/:id/recording')
  async attachWebinarRecording(@Param('id') id: string, @Body() dto: RecordingDto, @Req() req: Request) {
    const user = req.user as any;
    await this.verifyWebinarOwnership(id, user.userId, user.role);
    return this.webinarsService.attachRecording(id, dto.url);
  }

  @Get('webinars/:id/analytics')
  async getWebinarAnalytics(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    await this.verifyWebinarOwnership(id, user.userId, user.role);
    return this.webinarsService.getAnalytics(id);
  }

  private async verifyWebinarOwnership(webinarId: string, userId: string, role: Role) {
    const webinar = await this.webinarsService.findOneAdmin(webinarId);
    if (!webinar) throw new ForbiddenException('Webinar not found');
    if (role === Role.INSTRUCTOR && webinar.instructorId !== userId) {
      throw new ForbiddenException("Cannot modify another instructor's webinar");
    }
    return webinar;
  }
}
