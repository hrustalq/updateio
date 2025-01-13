import { Module } from '@nestjs/common';
import { SubscriptionsV1Controller } from './v1/subscriptions.controller';
import { SubscriptionsV1Service } from './v1/subscriptions.service';

@Module({
  controllers: [SubscriptionsV1Controller],
  providers: [SubscriptionsV1Service],
  exports: [SubscriptionsV1Service],
})
export class SubscriptionsModule {}
