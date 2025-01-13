import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResponse } from '../interfaces/pagination.interface';
import { Logger } from '../services/logger.service';

@Injectable()
export class MetadataInterceptor<T>
  implements NestInterceptor<T, PaginatedResponse<T>>
{
  private readonly logger = new Logger('MetadataInterceptor');
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

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<PaginatedResponse<T>> {
    const request = context.switchToHttp().getRequest();

    // Skip metadata processing for static files
    if (this.isStaticFile(request.path)) {
      return next.handle();
    }

    const host = request.get('host');
    const protocol = request.protocol;

    const routePath = request.route?.path || '';
    const method = request.method;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;

    const fullPath = `${protocol}://${host}${routePath}`.replace(/\/+/g, '/');

    this.logger.debug(
      `Incoming request: ${method} ${fullPath} | Agent: ${userAgent} | IP: ${ip}`,
    );

    return next.handle().pipe(
      map((response) => {
        const hasPagination = !!response?.metadata?.pagination;
        const logMessage = [
          `Response for: ${method} ${fullPath}`,
          `Status: Success`,
          hasPagination
            ? `Pagination: Page ${response.metadata.pagination.page} of ${response.metadata.pagination.totalPages}`
            : 'No Pagination',
        ].join(' | ');

        this.logger.debug(logMessage);

        // If response is already wrapped with metadata
        if (response?.metadata) {
          return {
            ...response,
            metadata: {
              ...response.metadata,
              timestamp: new Date().toISOString(),
              path: fullPath,
              version: request.version || 'unknown',
            },
          };
        }

        // Otherwise, create new metadata
        return {
          data: response,
          metadata: {
            timestamp: new Date().toISOString(),
            path: fullPath,
            version: request.version || 'unknown',
          },
        };
      }),
    );
  }
}
