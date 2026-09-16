import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module.js';
import { PdfService } from './pdf.service.js';
import { PaymentsService } from './payments.service.js';
import { PaymentsController } from './payments.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { QueueModule } from '../queue/queue.module.js';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    QueueModule,
    StorageModule,
    BullModule.registerQueue({
      name: 'invoice',
    }),
    BullModule.registerQueue({
      name: 'order-expiry',
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PdfService],
  exports: [PaymentsService, PdfService],
})
export class PaymentsModule {}
