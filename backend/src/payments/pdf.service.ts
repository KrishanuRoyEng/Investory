import { Injectable, Logger } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { StorageService } from '../storage/storage.service.js';

@Injectable()
export class PdfService {
  private logger = new Logger(PdfService.name);

  constructor(private storageService: StorageService) {}

  async generateAndUploadInvoice(orderId: string, orderDetails: any): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
          try {
            const pdfData = Buffer.concat(buffers);
            const key = `invoices/${orderId}.pdf`;
            await this.storageService.uploadFile(key, pdfData, 'application/pdf');
            // Assuming the bucket is public or we return a signed URL
            // In a real scenario, we might want to return just the key and generate signed URLs on demand
            resolve(key);
          } catch (uploadError) {
            this.logger.error('Error uploading invoice to S3', uploadError);
            reject(uploadError);
          }
        });

        // Basic Invoice Content
        doc.fontSize(20).text('Invoice', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Order ID: ${orderId}`);
        doc.text(`Amount: ₹${orderDetails.amount / 100}`);
        doc.text(`Date: ${new Date().toISOString()}`);
        doc.moveDown();
        doc.text('Thank you for your purchase!', { align: 'center' });
        
        doc.end();
      } catch (error) {
        this.logger.error('Error generating PDF invoice', error);
        reject(error);
      }
    });
  }

  async generateCertificateBuffer(userName: string, courseName: string, dateStr: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        // Landscape A4 for certificate
        const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
        const buffers: Buffer[] = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Certificate Content Styling
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke(); // Outer border
        doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke(); // Inner border

        doc.moveDown(4);
        doc.fontSize(40).text('CERTIFICATE OF COMPLETION', { align: 'center' });
        
        doc.moveDown(2);
        doc.fontSize(20).text('This is to certify that', { align: 'center' });
        
        doc.moveDown(1);
        doc.fontSize(30).fillColor('#0052cc').text(userName, { align: 'center' });
        
        doc.moveDown(1);
        doc.fontSize(20).fillColor('black').text('has successfully completed the course', { align: 'center' });
        
        doc.moveDown(1);
        doc.fontSize(25).fillColor('#0052cc').text(courseName, { align: 'center' });
        
        doc.moveDown(2);
        doc.fontSize(16).fillColor('black').text(`Date of Issue: ${dateStr}`, { align: 'center' });

        doc.end();
      } catch (error) {
        this.logger.error('Error generating certificate PDF', error);
        reject(error);
      }
    });
  }
}
