import { z } from 'zod';

// Environment variables schema
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  HOST: z.string().default('localhost'),
  PORT: z.string().transform(Number).default('3003'),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_TTL: z.string().default('4h'),
  REDIS_PASSWORD: z.string(),

  // Bot
  TELEGRAM_BOT_TOKEN: z.string(),
});

// Parse and validate environment variables
export const config = envSchema.parse(process.env);

// Bot configuration
export const botConfig = {
  // Session configuration
  session: {
    ttl: config.REDIS_TTL,
  },

  // Redis configuration
  redis: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD,
  },

  // Update types configuration
  updateTypes: ['patch', 'major', 'minor'] as const,

  // Notification frequencies
  notificationFrequencies: ['instant', 'daily', 'weekly'] as const,

  // Message formats
  messageFormats: ['short', 'detailed'] as const,
};
