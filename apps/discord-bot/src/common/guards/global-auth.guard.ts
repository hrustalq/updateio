import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class GlobalAuthGuard extends AuthGuard('jwt') {
  private executionContext: ExecutionContext;

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    this.executionContext = context;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Check if route has specific guards
    const guards = this.reflector.getAllAndOverride<any[]>('__guards__', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Skip if route is public or has specific guards
    if (isPublic || guards?.length) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      const request = this.executionContext.switchToHttp().getRequest();
      const host = request.get('host');
      const protocol = request.protocol;
      const basePath = '/api';
      const path = `${protocol}://${host}${basePath}${request.path}`.replace(
        /\/\/+/g,
        '/',
      );

      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
        path,
        timestamp: new Date().toISOString(),
      });
    }
    return user;
  }
}
