import { Context } from 'telegraf';
import { Injectable } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Injectable()
export class SettingsCommand {
  constructor(private readonly userService: UserService) {}

  async handle(ctx: Context) {
    if (!ctx.from) {
      return ctx.reply(
        'Произошла ошибка: Не удалось идентифицировать пользователя',
      );
    }

    try {
      // Get or create user
      await this.userService.findOrCreateUser(ctx.from.id.toString());

      const message = [
        '⚙️ *Настройки уведомлений*\n',
        '*Типы уведомлений:*',
        '• UPDATE \\- Обновления игр',
        '• REPORT \\- Отчеты и статистика',
        '• WARNING \\- Предупреждения',
        '• ERROR \\- Ошибки\n',
        '*Скоро будут доступны:*',
        '• Настройка типов уведомлений',
        '• Тихий режим',
        '• Формат сообщений',
        '• Частота уведомлений\n',
        '_Следите за обновлениями\\!_',
      ].join('\n');

      return ctx.replyWithMarkdownV2(message);
    } catch (error) {
      return ctx.reply(
        '❌ Произошла ошибка при загрузке настроек. Пожалуйста, попробуйте позже.',
      );
    }
  }
}
