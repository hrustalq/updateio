import { SetMetadata } from '@nestjs/common';
import { Context as TelegrafContext } from 'telegraf';
import { Message } from 'telegraf/types';

export const COMMAND_METADATA = 'command';

export const Command = (command: string) =>
  SetMetadata(COMMAND_METADATA, command);

export type Context = TelegrafContext & {
  message: Message.TextMessage;
};
