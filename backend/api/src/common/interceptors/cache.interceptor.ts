import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { CacheService } from '../modules/cache/cache.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpAdapterHost } from '@nestjs/core';

@Injectable()
export class HttpCacheInterceptor {
  private readonly WRITE_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];

  constructor(
    private readonly cacheService: CacheService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;
    const baseKey = httpAdapter.getRequestUrl(request);
    const queryParams = request.query;

    return Object.keys(queryParams).length
      ? `${baseKey}?${new URLSearchParams(queryParams).toString()}`
      : baseKey;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const key = this.trackBy(context);

    if (!key) {
      return next.handle();
    }

    if (this.WRITE_METHODS.includes(request.method)) {
      return next.handle().pipe(
        tap(async () => {
          const basePath = `${key.split('?')[0]}*`;
          const keys = await this.cacheService.keys(basePath);
          await Promise.all(keys.map((k) => this.cacheService.delete(k)));
        }),
      );
    }

    try {
      const value = await this.cacheService.get(key);
      if (value) {
        return of(value);
      }

      return next.handle().pipe(
        tap((response) => {
          this.cacheService.set(key, response);
        }),
      );
    } catch (err) {
      return next.handle();
    }
  }
}
