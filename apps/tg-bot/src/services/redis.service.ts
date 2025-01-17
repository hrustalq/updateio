import { createClient } from 'redis';
import { botConfig } from '../config';
import { Logger } from '@nestjs/common';

class RedisService {
  private client;
  private logger = new Logger(RedisService.name);

  constructor() {
    this.client = createClient({
      socket: {
        host: botConfig.redis.host,
        port: botConfig.redis.port,
      },
      password: botConfig.redis.password,
    });

    this.client.on('error', (err) =>
      this.logger.error('Redis Client Error', err),
    );
    this.client.on('connect', () => this.logger.log('Connected to Redis'));
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.disconnect();
  }

  async get(key: string) {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.client.set(key, value, { EX: ttl });
    } else {
      await this.client.set(key, value);
    }
  }

  async delete(key: string) {
    await this.client.del(key);
  }

  async exists(key: string) {
    return await this.client.exists(key);
  }
}

export const redisService = new RedisService();
