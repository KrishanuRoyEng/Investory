import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private logger = new Logger(StorageService.name);
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME || 'svdts-bucket';
    
    // In local dev, we might not have AWS credentials. We'll instantiate but only use it if credentials are provided or we might mock it.
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy-key',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy-secret',
      },
    });
  }

  async getSignedUrlForUpload(key: string, contentType: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      this.logger.error('Error generating signed URL for upload', error);
      throw error;
    }
  }

  async getSignedUrlForDownload(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      this.logger.error('Error generating signed URL for download', error);
      throw error;
    }
  }

  async uploadFile(key: string, body: Buffer | Uint8Array | string, contentType: string): Promise<void> {
    try {
      if (process.env.NODE_ENV !== 'production' && (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'dummy-key')) {
        this.logger.warn(`[DEV ONLY] Stubbing upload for ${key}`);
        return;
      }
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
      });
      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error('Error uploading file to S3', error);
      throw error;
    }
  }
}
