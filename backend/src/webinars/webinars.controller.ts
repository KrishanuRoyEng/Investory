import { Controller, Post, Get, Param, Body, Req, Query } from '@nestjs/common';
import { WebinarsService } from './webinars.service.js';
import { RegisterWebinarDto } from './dto/register-webinar.dto.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('webinars')
export class WebinarsController {
  constructor(private readonly webinarsService: WebinarsService) {}

  @Public()
  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user?.userId;
    const data = await this.webinarsService.findAll(userId);
    return { data, meta: null };
  }

  @Public()
  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.userId;
    const data = await this.webinarsService.findOne(id, userId);
    return { data, meta: null };
  }

  @Public()
  @Post(':id/register')
  async registerForWebinar(@Req() req: any, @Param('id') id: string, @Body() dto: RegisterWebinarDto) {
    const userId = req.user?.userId;
    const result = await this.webinarsService.registerForWebinar(id, dto, userId);
    return { data: result, meta: null };
  }

  @Public()
  @Get(':id/join')
  async getJoinDetails(@Req() req: any, @Param('id') id: string, @Query('ticketId') ticketId?: string) {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const details = await this.webinarsService.getJoinDetails(id, ticketId, userId, userRole);
    return { data: details, meta: null };
  }
}
