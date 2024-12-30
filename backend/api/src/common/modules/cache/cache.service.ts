import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.redisClient.get(key) as T;
  }
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.redisClient.set(
      key,
      JSON.stringify(value),
      ttl ? { EX: ttl } : {},
    );
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  /**
   * Get all keys matching the specified pattern
   * @param pattern - Redis key pattern (e.g., "user:*", "session:*")
   * @returns Array of matching keys
   */
  async keys(pattern: string): Promise<string[]> {
    return this.redisClient.keys(pattern);
  }

  /**
   * Get all values for keys matching the specified pattern
   * @param pattern - Redis key pattern (e.g., "user:*", "session:*")
   * @returns Array of [key, value] pairs
   */
  async getByPattern<T>(pattern: string): Promise<Array<[string, T]>> {
    const keys = await this.keys(pattern);
    const results: Array<[string, T]> = [];

    for (const key of keys) {
      const value = await this.get<T>(key);
      if (value !== undefined) {
        results.push([key, value]);
      }
    }

    return results;
  }
}
