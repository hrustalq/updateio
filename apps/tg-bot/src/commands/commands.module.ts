import { Module } from '@nestjs/common';
import { ServicesModule } from '../services/services.module';
import { StartCommand } from './start';
import { SubscribeCommand } from './subscribe';
import { UnsubscribeCommand } from './unsubscribe';
import { ListCommand } from './list';
import { SettingsCommand } from './settings';

@Module({
  imports: [ServicesModule],
  providers: [
    StartCommand,
    SubscribeCommand,
    UnsubscribeCommand,
    ListCommand,
    SettingsCommand,
  ],
  exports: [
    StartCommand,
    SubscribeCommand,
    UnsubscribeCommand,
    ListCommand,
    SettingsCommand,
  ],
})
export class CommandsModule {}
