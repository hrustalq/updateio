import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';
import { CacheKeyBuilder } from '../../utils/cache-key.util';
import { Logger } from '../../services/logger.service';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly ttl: number;
  private readonly prefix: string;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
    private readonly configService: ConfigService,
  ) {
    this.ttl = this.parseTTL(configService.get('redis.ttl', '4h'));
    this.prefix = configService.get('redis.prefix', 'api');
  }

  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Failed to get cache key: ${key}`, error.stack);
      return null;
    }
  }

  /**
   * Set a value in cache
   */
  async set(key: string, value: any, ttl?: number | string): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      const expiry = ttl ? this.parseTTL(ttl) : this.ttl;

      await this.redis.set(key, serializedValue, {
        EX: expiry,
      });
    } catch (error) {
      this.logger.error(`Failed to set cache key: ${key}`, error.stack);
    }
  }

  /**
   * Delete a value from cache
   */
  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(`Failed to delete cache key: ${key}`, error.stack);
    }
  }

  /**
   * Delete multiple values by pattern
   */
  async deleteByPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(keys);
      }
    } catch (error) {
      this.logger.error(`Failed to delete by pattern: ${pattern}`, error.stack);
    }
  }

  /**
   * Get all keys matching a pattern
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      this.logger.error(
        `Failed to get keys by pattern: ${pattern}`,
        error.stack,
      );
      return [];
    }
  }

  /**
   * Create a cache key builder
   */
  createKey(namespace?: string): CacheKeyBuilder {
    return CacheKeyBuilder.create(this.prefix).namespace(namespace || '');
  }

  /**
   * Parse TTL value to seconds
   */
  private parseTTL(ttl: string | number): number {
    if (typeof ttl === 'number') return ttl;

    const units: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    const match = ttl.match(/^(\d+)([smhd])$/);
    if (!match) {
      this.logger.warn(`Invalid TTL format: ${ttl}, using default 4h`);
      return 4 * 3600; // 4 hours default
    }

    const [, value, unit] = match;
    return parseInt(value) * units[unit];
  }
}
