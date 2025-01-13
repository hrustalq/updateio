import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import 'reflect-metadata';
import { CustomRequest } from '../types/request.types';

@Injectable()
export class VersionInterceptor implements NestInterceptor {
  private readonly staticFileExtensions = [
    '.json',
    '.html',
    '.js',
    '.css',
    '.ico',
  ];

  private isStaticFile(path: string): boolean {
    return this.staticFileExtensions.some((ext) => path.endsWith(ext));
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<CustomRequest>();

    // Skip version processing for static files
    if (this.isStaticFile(request.path)) {
      return next.handle();
    }

    const version = this.extractVersion(request, context);
    request.version = version;

    return next.handle();
  }

  private extractVersion(
    request: CustomRequest,
    context: ExecutionContext,
  ): string {
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
