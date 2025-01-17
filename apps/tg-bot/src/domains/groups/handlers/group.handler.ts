import { Context } from 'telegraf';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../../../services/user.service';
import { GroupService } from '../../../services/group.service';

@Injectable()
export class GroupHandler {
  private readonly logger = new Logger(GroupHandler.name);

  constructor(
    private readonly userService: UserService,
    private readonly groupService: GroupService,
  ) {}

  async onBotAdded(ctx: Context) {
    if (!ctx.chat || !ctx.from) {
      return;
    }

    try {
      // Check if user can add bot to more groups
      const canJoinGroup = await this.userService.canJoinGroup(
        ctx.from.id.toString(),
      );
      if (!canJoinGroup) {
        await ctx.reply(
          '❌ Вы достигли максимального количества групп. Удалите бота из неиспользуемых групп или обратитесь к администратору.',
        );
        await ctx.leaveChat();
        return;
      }

      // Create or update user
      const user = await this.userService.findOrCreateUser(
        ctx.from.id.toString(),
        ctx.from,
      );

      // Create or update group
      const group = await this.groupService.findOrCreateGroup(
        ctx.chat,
        user.id,
      );

      // Add user as member and admin
      await this.groupService.addMember(group.id, user.id);
      await this.groupService.addAdmin(group.id, user.id);

      await ctx.reply(
        '👋 Привет! Я буду отправлять уведомления об обновлениях игр в эту группу.\n\n' +
          'Используйте следующие команды:\n' +
          '/subscribe <игра> - Подписаться на обновления\n' +
          '/unsubscribe <игра> - Отписаться от обновлений\n' +
          '/list - Показать активные подписки\n' +
          '/settings - Настройки уведомлений',
      );
    } catch (error) {
      this.logger.error('Error handling bot added to group', error);
      await ctx.reply(
        '❌ Произошла ошибка при настройке бота. Пожалуйста, попробуйте позже или обратитесь к администратору.',
      );
      await ctx.leaveChat();
    }
  }

  async onBotRemoved(ctx: Context) {
    if (!ctx.chat || !ctx.from) {
      return;
    }

    try {
      const user = await this.userService.findOrCreateUser(
        ctx.from.id.toString(),
        ctx.from,
      );
      const group = await this.groupService.findOrCreateGroup(
        ctx.chat,
        user.id,
      );
      await this.groupService.deactivateGroup(group.id);
    } catch (error) {
      this.logger.error('Error handling bot removed from group', error);
    }
  }

  async onNewMember(ctx: Context) {
    if (!ctx.chat || !ctx.from || !('new_chat_members' in ctx.message)) {
      return;
    }

    try {
      const user = await this.userService.findOrCreateUser(
        ctx.from.id.toString(),
        ctx.from,
      );
      const group = await this.groupService.findOrCreateGroup(
        ctx.chat,
        user.id,
      );

      for (const member of ctx.message.new_chat_members) {
        if (member.is_bot) continue;

        const newUser = await this.userService.findOrCreateUser(
          member.id.toString(),
          member,
        );
        await this.groupService.addMember(group.id, newUser.id);
      }
    } catch (error) {
      this.logger.error('Error handling new members', error);
    }
  }

  async onMemberLeft(ctx: Context) {
    if (!ctx.chat || !ctx.from || !('left_chat_member' in ctx.message)) {
      return;
    }

    try {
      const user = await this.userService.findOrCreateUser(
        ctx.from.id.toString(),
        ctx.from,
      );
      const group = await this.groupService.findOrCreateGroup(
        ctx.chat,
        user.id,
      );

      const leftMember = ctx.message.left_chat_member;
      if (!leftMember.is_bot) {
        const leftUser = await this.userService.findOrCreateUser(
          leftMember.id.toString(),
          leftMember,
        );
        await this.groupService.removeMember(group.id, leftUser.id);
      }
    } catch (error) {
      this.logger.error('Error handling member left', error);
    }
  }
}
