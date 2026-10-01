import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RedisModule } from '../redis/redis.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { PaymentsModule } from '../payments/payments.module.js';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    PrismaModule, 
    RedisModule, 
    AuthModule, 
    PaymentsModule,
    BullModule.registerQueue({ name: 'certificates' })
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
