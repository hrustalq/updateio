import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || 'redis',
  ttl: process.env.REDIS_TTL || '4h',
  prefix: process.env.REDIS_PREFIX || 'api',
}));
