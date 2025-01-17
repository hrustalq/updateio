import { Command, Context } from '../../../common/decorators/command.decorator';
import { Injectable, Logger } from '@nestjs/common';
import { GroupAdminService } from '../services/group-admin.service';

@Injectable()
export class GroupCommand {
  private readonly logger = new Logger(GroupCommand.name);

  constructor(private readonly groupAdminService: GroupAdminService) {}

  @Command('group_info')
  async getGroupInfo(ctx: Context) {
    if (!ctx.message.chat || ctx.message.chat.type === 'private') {
      await ctx.reply('This command can only be used in groups');
      return;
    }

    const groupInfo = await this.groupAdminService.getGroupInfo(
      ctx.message.chat.id.toString(),
    );
    if (!groupInfo) {
      await ctx.reply('Group not found');
      return;
    }

    const memberCount = groupInfo.members.length;
    const adminCount = groupInfo.members.filter(
      (m) => m.role === 'ADMIN' || m.role === 'OWNER',
    ).length;
    const subscriptionCount = groupInfo.subscriptionCount;

    const message = [
      `📊 Group Info for ${groupInfo.title}`,
      ``,
      `👥 Members: ${memberCount}`,
      `👑 Admins: ${adminCount}`,
      `🎮 Subscriptions: ${subscriptionCount}/${groupInfo.settings.maxSubscriptions}`,
      ``,
      `Settings:`,
      `- Notifications: ${groupInfo.settings.notificationsEnabled ? '✅' : '❌'}`,
      `- Member Subscribe: ${groupInfo.settings.allowMemberSubscribe ? '✅' : '❌'}`,
      `- Member Unsubscribe: ${groupInfo.settings.allowMemberUnsubscribe ? '✅' : '❌'}`,
      `- Timezone: ${groupInfo.settings.timezone}`,
    ].join('\n');

    await ctx.reply(message);
  }

  @Command('group_stats')
  async getGroupStats(ctx: Context) {
    if (!ctx.message.chat || ctx.message.chat.type === 'private') {
      await ctx.reply('This command can only be used in groups');
      return;
    }

    const stats = await this.groupAdminService.getGroupStats(
      ctx.message.chat.id.toString(),
    );
    if (!stats) {
      await ctx.reply('Group not found');
      return;
    }

    const message = [
      `📈 Group Statistics`,
      ``,
      `👥 Total Members: ${stats.memberCount}`,
      `👑 Admins: ${stats.adminCount}`,
      `🎮 Active Subscriptions: ${stats.subscriptionCount}`,
      ``,
      `Games:`,
      ...stats.games.map((game) => `- ${game.name} (${game.provider})`),
    ].join('\n');

    await ctx.reply(message);
  }

  @Command('group_settings')
  async updateGroupSettings(ctx: Context) {
    if (!ctx.message.chat || ctx.message.chat.type === 'private') {
      await ctx.reply('This command can only be used in groups');
      return;
    }

    const groupInfo = await this.groupAdminService.getGroupInfo(
      ctx.message.chat.id.toString(),
    );
    if (!groupInfo) {
      await ctx.reply('Group not found');
      return;
    }

    const member = groupInfo.members.find(
      (m) => m.userId === ctx.message.from.id.toString(),
    );
    if (!member?.canManageSettings) {
      await ctx.reply('You do not have permission to manage group settings');
      return;
    }

    // TODO: Implement settings menu using inline keyboard
    await ctx.reply('Settings menu will be implemented soon');
  }

  @Command('group_members')
  async listMembers(ctx: Context) {
    if (!ctx.message.chat || ctx.message.chat.type === 'private') {
      await ctx.reply('This command can only be used in groups');
      return;
    }

    const groupInfo = await this.groupAdminService.getGroupInfo(
      ctx.message.chat.id.toString(),
    );
    if (!groupInfo) {
      await ctx.reply('Group not found');
      return;
    }

    const member = groupInfo.members.find(
      (m) => m.userId === ctx.message.from.id.toString(),
    );
    if (!member?.canManageMembers) {
      await ctx.reply('You do not have permission to view member list');
      return;
    }

    const membersByRole = groupInfo.members.reduce(
      (acc, m) => {
        acc[m.role] = acc[m.role] || [];
        acc[m.role].push(m);
        return acc;
      },
      {} as Record<string, typeof groupInfo.members>,
    );

    const message = [
      `👥 Group Members`,
      ``,
      `👑 Owner:`,
      ...(membersByRole['OWNER']?.map((m) => `- ${m.userId}`) || []),
      ``,
      `⭐️ Admins:`,
      ...(membersByRole['ADMIN']?.map((m) => `- ${m.userId}`) || []),
      ``,
      `👤 Members:`,
      ...(membersByRole['MEMBER']?.map((m) => `- ${m.userId}`) || []),
    ].join('\n');

    await ctx.reply(message);
  }
}
