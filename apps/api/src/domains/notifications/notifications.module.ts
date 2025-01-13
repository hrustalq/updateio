import { Module } from '@nestjs/common';
import { NotificationsV1Controller } from './v1/notifications.controller';
import { NotificationsV1Service } from './v1/notifications.service';

@Module({
  controllers: [NotificationsV1Controller],
  providers: [NotificationsV1Service],
  exports: [NotificationsV1Service],
})
export class NotificationsModule {}
