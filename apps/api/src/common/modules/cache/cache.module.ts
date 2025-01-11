import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';
import redisConfig from 'src/config/redis.config';
import { createClient } from 'redis';

@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const redisUrl = `redis://:${configService.get('redis.password')}@${configService.get('redis.host')}:${configService.get('redis.port')}`;

        const redisClient = createClient({
          url: redisUrl,
        });

        await redisClient.connect();
        return redisClient;
      },
      inject: [ConfigService],
    },
    CacheService,
  ],
  exports: ['REDIS_CLIENT', CacheService],
})
export class CacheModule {}
