import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { MinioConfig } from '../../../config/minio.config';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;

  constructor(private configService: ConfigService) {
    const minioConfig = this.configService.get<MinioConfig>('minio');

    this.minioClient = new Minio.Client({
      endPoint: minioConfig.MINIO_ENDPOINT,
      port: minioConfig.MINIO_PORT,
      useSSL: minioConfig.MINIO_USE_SSL,
      accessKey: minioConfig.MINIO_ACCESS_KEY,
      secretKey: minioConfig.MINIO_SECRET_KEY,
    });
  }

  async onModuleInit() {
    const bucketName =
      this.configService.get<MinioConfig>('minio').MINIO_BUCKET_NAME;
    const bucketExists = await this.minioClient.bucketExists(bucketName);

    if (!bucketExists) {
      await this.minioClient.makeBucket(bucketName);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    objectName: string,
  ): Promise<string> {
    const bucketName =
      this.configService.get<MinioConfig>('minio').MINIO_BUCKET_NAME;

    await this.minioClient.putObject(
      bucketName,
      objectName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    return objectName;
  }

  async deleteFile(objectName: string): Promise<void> {
    const bucketName =
      this.configService.get<MinioConfig>('minio').MINIO_BUCKET_NAME;
    await this.minioClient.removeObject(bucketName, objectName);
  }

  async getFileUrl(objectName: string): Promise<string> {
    const bucketName =
      this.configService.get<MinioConfig>('minio').MINIO_BUCKET_NAME;
    return await this.minioClient.presignedGetObject(
      bucketName,
      objectName,
      24 * 60 * 60,
    ); // 24 hours expiry
  }
}
