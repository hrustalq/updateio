import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from './public.decorator';
import { LocalGuard } from '../../domains/auth/guards/local.guard';
import { JwtGuard } from '../../domains/auth/guards/jwt.guard';

export enum AuthType {
  None = 'none',
  Bearer = 'bearer',
  Local = 'local',
}

interface AuthOptions {
  public?: boolean;
  type?: AuthType;
}

export function Auth(options: AuthOptions = {}) {
  const { public: isPublic, type = AuthType.Bearer } = options;
  const decorators = [ApiTags('Authentication')];

  if (isPublic) {
    decorators.push(Public());
  }

  switch (type) {
    case AuthType.Bearer:
      decorators.push(ApiBearerAuth(), UseGuards(JwtGuard));
      break;
    case AuthType.Local:
      decorators.push(UseGuards(LocalGuard));
      break;
    case AuthType.None:
    default:
      break;
  }

  return applyDecorators(...decorators);
}
