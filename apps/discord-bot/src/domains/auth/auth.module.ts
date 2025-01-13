import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './v1/auth.service';
import { AuthController } from './v1/auth.controller';
import { JwtStrategy } from './v1/strategies/jwt.strategy';
import { LocalStrategy } from './v1/strategies/local.strategy';
import { CacheModule } from '../../common/modules/cache/cache.module';
import { UsersModule } from '../users/users.module';
import { JwtGuard } from './v1/guards/jwt.guard';
import { LocalGuard } from './v1/guards/local.guard';
import { TelegramGuard } from './v1/guards/telegram.guard';
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
