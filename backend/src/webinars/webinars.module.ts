import { Module } from '@nestjs/common';
import { WebinarsController } from './webinars.controller.js';
import { WebinarsService } from './webinars.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AgoraModule } from '../agora/agora.module.js';

@Module({
  imports: [PrismaModule, AgoraModule],
  controllers: [WebinarsController],
  providers: [WebinarsService],
  exports: [WebinarsService],
})
export class WebinarsModule {}
