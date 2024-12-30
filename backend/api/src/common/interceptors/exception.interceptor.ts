import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Request } from 'express';
import { ErrorResponse } from '../interfaces/error-response.interface';
import { Logger } from '../services/logger.service';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger('ExceptionHandler');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const host = request.get('host');
    const protocol = request.protocol;
    const basePath = '/api';
    const routePath = request.route?.path || '';
    const method = request.method;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;
    const version = request.version || '1';

    const fullPath = `${protocol}://${host}${basePath}${routePath}`.replace(
      /\/+/g,
      '/',
    );

    return next.handle().pipe(
      catchError((error) => {
        let exception: HttpException;

        if (error instanceof HttpException) {
          if (error instanceof BadRequestException) {
            const validationErrors = error.getResponse() as any;
            if (Array.isArray(validationErrors.message)) {
              exception = new BadRequestException({
                statusCode: 400,
                message: validationErrors.message,
                error: 'Validation Failed',
              });
            } else {
              exception = error;
            }
          } else {
            exception = error;
          }
        } else {
          this.logger.error(
            [
              'Unexpected error occurred:',
              error?.message,
              `${method} ${fullPath}`,
              userAgent,
              ip,
            ].join(' | '),
            error?.stack,
          );
          exception = new InternalServerErrorException(
            error?.message || 'Internal server error',
          );
        }

        const response = exception.getResponse() as
          | string
          | { statusCode: number; message: string | string[]; error: string };

        const errorResponse: ErrorResponse = {
          statusCode:
            typeof response === 'string'
              ? exception.getStatus()
              : response.statusCode,
          message:
            typeof response === 'string'
              ? response
              : response.message || exception.message,
          error:
            typeof response === 'string'
              ? exception.message
              : response.error || 'Internal Server Error',
          timestamp: new Date().toISOString(),
          path: fullPath,
          version,
        };

        const logMessage = [
          `${method} ${fullPath}`,
          `Status: ${errorResponse.statusCode}`,
          `Error: ${
            Array.isArray(errorResponse.message)
              ? errorResponse.message.join(', ')
              : errorResponse.message
          }`,
          `Agent: ${userAgent}`,
          `IP: ${ip}`,
        ].join(' | ');

        if (errorResponse.statusCode >= 500) {
          this.logger.error(logMessage, error?.stack);
        } else {
          this.logger.warn(logMessage);
        }

        return of(errorResponse);
      }),
    );
  }
}
