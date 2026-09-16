import { Controller, Post, Get, Param, Body, Req } from '@nestjs/common';
import { LiveSessionsService } from './live-sessions.service.js';
import { SubmitDoubtDto } from './dto/submit-doubt.dto.js';

@Controller('live-sessions')
export class LiveSessionsController {
  constructor(private readonly liveSessionsService: LiveSessionsService) {}

  @Post(':id/register')
  async registerForSession(@Req() req: any, @Param('id') id: string) {
    return this.liveSessionsService.registerForSession(req.user.userId, id);
  }

  @Get(':id/join')
  async getJoinDetails(@Req() req: any, @Param('id') id: string) {
    const details = await this.liveSessionsService.getJoinDetails(req.user.userId, id, req.user.role);
    return { data: details, meta: null };
  }

  @Post(':id/doubts')
  async submitDoubt(@Req() req: any, @Param('id') id: string, @Body() dto: SubmitDoubtDto) {
    const doubt = await this.liveSessionsService.submitDoubt(req.user.userId, id, dto.question);
    return { data: doubt, meta: null };
  }
}
