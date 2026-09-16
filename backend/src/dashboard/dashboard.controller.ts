import { Controller, Get, Put, Body, Query, Req, Res, HttpCode, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';
import type { Response } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Put('profile')
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.dashboardService.updateProfile(req.user.userId, dto);
  }

  @Put('password')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async updatePassword(@Req() req: any, @Res({ passthrough: true }) res: Response, @Body() dto: ChangePasswordDto) {
    const result = await this.dashboardService.updatePassword(req.user.userId, dto);
    
    // Clear the refresh token cookie since all sessions are revoked
    const isDev = process.env.NODE_ENV !== 'production';
    const sameSiteConfig = process.env.COOKIE_SAME_SITE?.toLowerCase() === 'none' ? 'none' : 'strict';
    
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: sameSiteConfig === 'none' ? true : !isDev,
      sameSite: sameSiteConfig as any,
      path: '/api/v1/auth',
    });

    return result;
  }

  @Get('courses')
  async getEnrolledCourses(@Req() req: any, @Query() query: PaginationQueryDto) {
    return this.dashboardService.getEnrolledCourses(req.user.userId, query);
  }

  @Get('sessions')
  async getUpcomingSessions(@Req() req: any, @Query() query: PaginationQueryDto) {
    return this.dashboardService.getUpcomingSessions(req.user.userId, query);
  }

  @Get('orders')
  async getOrderHistory(@Req() req: any, @Query() query: PaginationQueryDto) {
    return this.dashboardService.getOrderHistory(req.user.userId, query);
  }

  @Get('certificates')
  async getCertificates(@Req() req: any, @Query() query: PaginationQueryDto) {
    return this.dashboardService.getCertificates(req.user.userId, query);
  }

  @Get('doubts')
  async getDoubts(@Req() req: any, @Query() query: PaginationQueryDto) {
    return this.dashboardService.getDoubts(req.user.userId, query);
  }

  @Get('certificates/:courseId/download')
  async getCertificateDownload(@Req() req: any, @Param('courseId') courseId: string, @Res() res: Response) {
    const buffer = await this.dashboardService.downloadCertificate(req.user.userId, courseId);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificate-${courseId}.pdf"`,
      'Content-Length': buffer.length,
    });
    
    res.end(buffer);
  }
}
