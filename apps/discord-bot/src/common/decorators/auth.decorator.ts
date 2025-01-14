import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Public } from './public.decorator';
import { ApiKeyGuard } from '../../domains/auth/v1/guards/api-key.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(options: { public?: boolean } = {}) {
  const { public: isPublic } = options;
  const decorators = [ApiTags('Authentication')];

  if (isPublic) {
    decorators.push(Public());
  } else {
    decorators.push(ApiSecurity('api-key'), UseGuards(ApiKeyGuard, RolesGuard));
  }

  return applyDecorators(...decorators);
}
