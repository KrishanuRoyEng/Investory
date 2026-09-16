import { Module } from '@nestjs/common';
import { LiveSessionsController } from './live-sessions.controller.js';
import { LiveSessionsService } from './live-sessions.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AgoraModule } from '../agora/agora.module.js';

@Module({
  imports: [PrismaModule, AgoraModule],
  controllers: [LiveSessionsController],
  providers: [LiveSessionsService],
  exports: [LiveSessionsService],
})
export class LiveSessionsModule {}
