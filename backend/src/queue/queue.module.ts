import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InvoiceProcessor } from './invoice.processor.js';
import { OrderExpiryProcessor } from './order-expiry.processor.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PaymentsModule } from '../payments/payments.module.js';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => PaymentsModule),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
        const url = new URL(redisUrl);
        return {
          connection: {
            host: url.hostname,
            port: parseInt(url.port) || 6379,
            password: url.password || undefined,
            username: url.username || undefined,
            tls: url.protocol === "rediss:" ? {} : undefined,
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'invoice',
    }),
    BullModule.registerQueue({
      name: 'order-expiry',
    }),
  ],
  providers: [InvoiceProcessor, OrderExpiryProcessor],
  exports: [BullModule],
})
export class QueueModule {}
