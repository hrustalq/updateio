import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const minioConfigSchema = z.object({
  MINIO_ENDPOINT: z.string().default('localhost'),
  MINIO_PORT: z.coerce.number().default(9000),
  MINIO_ACCESS_KEY: z.string().default('minioadmin'),
  MINIO_SECRET_KEY: z.string().default('minioadmin'),
  MINIO_USE_SSL: z.coerce.boolean().default(false),
  MINIO_BUCKET_NAME: z.string().default('updateio'),
});

export type MinioConfig = z.infer<typeof minioConfigSchema>;

export default registerAs('minio', () => {
  const config = minioConfigSchema.parse({
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    MINIO_PORT: process.env.MINIO_PORT,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
    MINIO_USE_SSL: process.env.MINIO_USE_SSL,
    MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME,
  });

  return config;
});
