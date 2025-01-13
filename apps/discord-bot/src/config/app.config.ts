import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '',
  port: process.env.PORT || 3000,
}));
