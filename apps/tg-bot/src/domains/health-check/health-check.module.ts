import { Module } from '@nestjs/common';
import { HealthCheckController } from './v1/health-check.controller';
import { HealthCheckService } from './v1/health-check.service';

@Module({
  controllers: [HealthCheckController],
  providers: [HealthCheckService],
})
export class HealthCheckModule {}
