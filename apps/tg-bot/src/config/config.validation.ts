import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsPort,
  IsString,
  IsOptional,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNotEmpty()
  HOST: string;

  @IsNotEmpty()
  @IsPort()
  PORT: string;

  @IsString()
  @IsOptional()
  REDIS_HOST: string;

  @IsPort()
  @IsNotEmpty()
  REDIS_PORT: string;

  @IsString()
  @IsOptional()
  REDIS_TTL: string = '4h';

  @IsString()
  @IsOptional()
  REDIS_PASSWORD: string;

  @IsString()
  @IsOptional()
  REDIS_PREFIX: string = 'api';

  @IsString()
  @IsOptional()
  TELEGRAM_BOT_TOKEN: string;
}

export function validate(config: Record<string, unknown>) {
  const validateConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validateConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validateConfig;
}
