import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../domains/auth/v1/guards/api-key.guard';
import { ApiHeader } from '@nestjs/swagger';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const Auth = () => {
  return applyDecorators(
    UseGuards(ApiKeyGuard),
    ApiHeader({
      name: 'X-API-KEY',
      description: 'API key for authentication',
      required: true,
    }),
  );
};
