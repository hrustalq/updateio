import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import 'reflect-metadata';

@Injectable()
export class VersionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const version = this.extractVersion(request, context);
    request.version = version;

    return next.handle();
  }

  private extractVersion(request: Request, context: ExecutionContext): string {
    // Try to get version from controller metadata
    const controller = context.getClass();
    const routeVersion = Reflect.getMetadata('version', controller);
    if (routeVersion) return routeVersion;

    // Try to get version from URL (assuming format: /v1/...)
    const urlVersion = request.path.match(/^\/v(\d+)\//)?.[1];
    if (urlVersion) return urlVersion;

    // Default version
    return '1';
  }
}
