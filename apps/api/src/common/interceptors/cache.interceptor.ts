import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../modules/cache/cache.service';
import {
  CACHE_KEY_METADATA,
  CACHE_TTL_METADATA,
  CacheOptions,
} from '../decorators/cache.decorator';
import { Logger } from '../services/logger.service';

@Injectable()
export class HttpCacheInterceptor {
  private readonly logger = new Logger('CacheInterceptor');
  private readonly WRITE_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];

  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const cacheOptions = this.reflector.get<CacheOptions>(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    if (!cacheOptions || this.WRITE_METHODS.includes(request.method)) {
      return this.handleWriteMethod(context, next);
    }

    const cacheKey = this.buildCacheKey(context, cacheOptions);
    const ttl = this.reflector.get<string | number>(
      CACHE_TTL_METADATA,
      context.getHandler(),
    );

    try {
      const cachedValue = await this.cacheService.get(cacheKey);
      if (cachedValue) {
        this.logger.debug(`Cache hit: ${cacheKey}`);
        return of(cachedValue);
      }

      return next.handle().pipe(
        tap((response) => {
          this.logger.debug(`Cache miss: ${cacheKey}`);
          this.cacheService.set(cacheKey, response, ttl);
        }),
      );
    } catch (err) {
      this.logger.error(`Cache error: ${err.message}`, err.stack);
      return next.handle();
    }
  }

  private buildCacheKey(
    context: ExecutionContext,
    options: CacheOptions,
  ): string {
    const request = context.switchToHttp().getRequest();
    const builder = this.cacheService.createKey(options.namespace);

    if (typeof options.key === 'function') {
      builder.identifier(options.key(request));
    } else if (options.key) {
      builder.identifier(options.key);
    } else {
      builder.identifier(request.url);
    }

    return builder.build();
  }

  private handleWriteMethod(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      tap(async () => {
        const cacheOptions = this.reflector.get<CacheOptions>(
          CACHE_KEY_METADATA,
          context.getHandler(),
        );

        if (cacheOptions?.namespace) {
          const pattern = this.cacheService
            .createKey(cacheOptions.namespace)
            .pattern();
          await this.cacheService.deleteByPattern(pattern);
          this.logger.debug(`Invalidated cache pattern: ${pattern}`);
        }
      }),
    );
  }
}
