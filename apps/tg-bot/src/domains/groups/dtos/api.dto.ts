import { ApiProperty } from '@nestjs/swagger';
import { GroupInfo, GroupSettings, GroupMember } from './group.dto';

export class GroupSettingsResponseDto implements GroupSettings {
  @ApiProperty({
    description: 'Maximum number of subscriptions allowed',
    minimum: 1,
    maximum: 20,
  })
  maxSubscriptions: number;

  @ApiProperty({ description: 'Whether notifications are enabled' })
  notificationsEnabled: boolean;

  @ApiProperty({ description: 'Whether members can subscribe to games' })
  allowMemberSubscribe: boolean;

  @ApiProperty({ description: 'Whether members can unsubscribe from games' })
  allowMemberUnsubscribe: boolean;

  @ApiProperty({ description: 'Start time for quiet hours', required: false })
  quietHoursStart?: string;

  @ApiProperty({ description: 'End time for quiet hours', required: false })
  quietHoursEnd?: string;

  @ApiProperty({ description: 'Timezone for the group', default: 'UTC' })
  timezone: string;
}

export class GroupMemberResponseDto implements GroupMember {
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({
    description: 'Member role',
    enum: ['OWNER', 'ADMIN', 'MEMBER'],
  })
  role: 'OWNER' | 'ADMIN' | 'MEMBER';

  @ApiProperty({ description: 'Whether member can manage subscriptions' })
  canManageSubscriptions: boolean;

  @ApiProperty({ description: 'Whether member can manage other members' })
  canManageMembers: boolean;

  @ApiProperty({ description: 'Whether member can manage group settings' })
  canManageSettings: boolean;
}

export class GroupInfoResponseDto implements GroupInfo {
  @ApiProperty({ description: 'Group ID' })
  id: string;

  @ApiProperty({ description: 'Telegram group ID' })
  telegramId: string;

  @ApiProperty({ description: 'Group title' })
  title: string;

  @ApiProperty({ description: 'Group type' })
  type: string;

  @ApiProperty({ description: 'Whether the group is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Group settings' })
  settings: GroupSettingsResponseDto;

  @ApiProperty({ description: 'Group members', type: [GroupMemberResponseDto] })
  members: GroupMemberResponseDto[];

  @ApiProperty({ description: 'Number of active subscriptions' })
  subscriptionCount: number;

  @ApiProperty({ description: 'Group creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export class GameInfoDto {
  @ApiProperty({ description: 'Game ID' })
  id: string;

  @ApiProperty({ description: 'Game name' })
  name: string;

  @ApiProperty({ description: 'Game provider' })
  provider: string;
}

export class GroupStatsResponseDto {
  @ApiProperty({ description: 'Total number of members' })
  memberCount: number;

  @ApiProperty({ description: 'Number of admins' })
  adminCount: number;

  @ApiProperty({ description: 'Number of active subscriptions' })
  subscriptionCount: number;

  @ApiProperty({ description: 'List of games', type: [GameInfoDto] })
  games: GameInfoDto[];
}

export class SuccessResponseDto {
  @ApiProperty({ description: 'Operation success status', default: true })
  success: boolean;
}
