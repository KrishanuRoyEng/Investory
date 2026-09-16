import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PdfService } from '../payments/pdf.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Processor('invoice')
export class InvoiceProcessor extends WorkerHost {
  private readonly logger = new Logger(InvoiceProcessor.name);

  constructor(
    private readonly pdfService: PdfService,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { orderId } = job.data;
    this.logger.log(`Processing invoice job for Order: ${orderId}`);
    
    const order = await this.prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      this.logger.error(`Order ${orderId} not found`);
      return;
    }

    try {
      const invoiceUrl = await this.pdfService.generateAndUploadInvoice(orderId, {
        amount: order.totalPaise,
        date: order.createdAt
      });
      
      await this.prisma.order.update({
        where: { id: orderId },
        data: { invoiceUrl }
      });

      this.logger.log(`Successfully generated and uploaded invoice for Order: ${orderId}. URL/Key: ${invoiceUrl}`);
    } catch (error) {
      this.logger.error(`Failed to generate invoice for Order: ${orderId}`, error);
    }
    
    return {};
  }
}
