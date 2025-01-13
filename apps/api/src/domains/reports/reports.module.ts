import { Module } from '@nestjs/common';
import { ReportsV1Controller } from './v1/reports.controller';
import { ReportsV1Service } from './v1/reports.service';

@Module({
  controllers: [ReportsV1Controller],
  providers: [ReportsV1Service],
  exports: [ReportsV1Service],
})
export class ReportsModule {}
