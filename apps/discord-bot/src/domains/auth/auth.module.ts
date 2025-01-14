import { Module } from '@nestjs/common';
import { AuthService } from './v1/auth.service';
import { AuthController } from './v1/auth.controller';
import { ApiKeyStrategy } from './v1/strategies/api-key.strategy';
import { UsersModule } from '../users/users.module';
import { ApiKeyGuard } from './v1/guards/api-key.guard';
import { PrismaModule } from '../../common/modules/prisma/prisma.module';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [UsersModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, ApiKeyStrategy, ApiKeyGuard, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
