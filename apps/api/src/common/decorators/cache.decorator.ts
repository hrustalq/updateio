import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY_METADATA = 'cache_key_metadata';
export const CACHE_TTL_METADATA = 'cache_ttl_metadata';

export interface CacheOptions {
  namespace?: string;
  key?: string | ((...args: any[]) => string);
  ttl?: string | number;
}

export const Cache = (options: CacheOptions = {}) => {
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): void => {
    SetMetadata(CACHE_KEY_METADATA, options)(target, propertyKey, descriptor);
    if (options.ttl) {
      SetMetadata(CACHE_TTL_METADATA, options.ttl)(
        target,
        propertyKey,
        descriptor,
      );
    }
  };
};
