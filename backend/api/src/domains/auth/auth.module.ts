import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { CacheModule } from '../../common/modules/cache/cache.module';
import { UsersModule } from '../users/users.module';
import { JwtGuard } from './guards/jwt.guard';
import { LocalGuard } from './guards/local.guard';
import { TelegramGuard } from './guards/telegram.guard';
import authConfig from '../../config/auth.config';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    CacheModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authConfig)],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.jwt.secret'),
        signOptions: {
          expiresIn: configService.get('auth.jwt.accessExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    JwtGuard,
    LocalGuard,
    TelegramGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
