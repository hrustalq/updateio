import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { PaginatedResponse } from '../interfaces/pagination.interface';
import { Logger } from '../services/logger.service';

@Injectable()
export class MetadataInterceptor<T>
  implements NestInterceptor<T, PaginatedResponse<T>>
{
  private readonly logger = new Logger('MetadataInterceptor');

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<PaginatedResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const host = request.get('host');
    const protocol = request.protocol;
    const basePath = '/api';
    const routePath = request.route?.path || '';
    const method = request.method;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;

    const fullPath = `${protocol}://${host}${basePath}${routePath}`.replace(
      /\/+/g,
      '/',
    );

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
              version: request.version,
            },
          };
        }

        // Otherwise, create new metadata
        return {
          data: response,
          metadata: {
            timestamp: new Date().toISOString(),
            path: fullPath,
            version: request.version,
          },
        };
      }),
    );
  }
}
