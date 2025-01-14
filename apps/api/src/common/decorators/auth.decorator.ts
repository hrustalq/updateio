import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from './public.decorator';
import { LocalGuard } from '../../domains/auth/v1/guards/local.guard';
import { JwtGuard } from '../../domains/auth/v1/guards/jwt.guard';

export enum AuthType {
  Bearer = 'Bearer',
  Local = 'Local',
  Telegram = 'Telegram',
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
    case AuthType.Telegram:
    default:
      break;
  }

  return applyDecorators(...decorators);
}
