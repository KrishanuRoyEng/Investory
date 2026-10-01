import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service.js';
import { PdfService } from '../payments/pdf.service.js';
import { StorageService } from '../storage/storage.service.js';
import { Logger } from '@nestjs/common';

@Processor('certificates')
export class CertificateProcessor extends WorkerHost {
  private readonly logger = new Logger(CertificateProcessor.name);

  constructor(
    private prisma: PrismaService,
    private pdfService: PdfService,
    private storageService: StorageService,
  ) {
    super();
  }

  async process(job: Job<{ userId: string; courseId: string }, any, string>): Promise<any> {
    const { userId, courseId } = job.data;
    
    // Check if certificate already exists with a URL
    const existing = await this.prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });
    
    if (existing && existing.url) {
      this.logger.log(`Certificate already exists for user ${userId} and course ${courseId}`);
      return;
    }

    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { user: true, course: true }
    });

    if (!enrollment || enrollment.progressPercent < 100) {
      this.logger.warn(`User ${userId} has not completed course ${courseId}`);
      return;
    }

    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const pdfBuffer = await this.pdfService.generateCertificateBuffer(
      enrollment.user.name,
      enrollment.course.title,
      dateStr
    );

    const s3Key = `certificates/${courseId}/${userId}.pdf`;
    
    await this.storageService.uploadFile(s3Key, pdfBuffer, 'application/pdf');

    const s3Url = `https://${process.env.S3_BUCKET_NAME || 'svdts-bucket'}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${s3Key}`;

    await this.prisma.certificate.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { url: s3Url },
      create: {
        userId,
        courseId,
        url: s3Url,
      }
    });

    this.logger.log(`Certificate generated and uploaded for user ${userId}, course ${courseId}`);
  }
}
