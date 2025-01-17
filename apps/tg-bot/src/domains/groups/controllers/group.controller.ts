import { Controller, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GroupAdminService } from '../services/group-admin.service';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { GroupInfo } from '../dtos/group.dto';
import {
  GroupInfoResponseDto,
  GroupStatsResponseDto,
  SuccessResponseDto,
} from '../dtos/api.dto';

class UpdateGroupSettingsDto {
  @IsOptional()
  maxSubscriptions?: number;

  @IsOptional()
  notificationsEnabled?: boolean;

  @IsOptional()
  allowMemberSubscribe?: boolean;

  @IsOptional()
  allowMemberUnsubscribe?: boolean;

  @IsOptional()
  timezone?: string;
}

class UpdateMemberRoleDto {
  @IsString()
  userId: string;

  @IsEnum(['ADMIN', 'MEMBER'])
  role: 'ADMIN' | 'MEMBER';
}

@ApiTags('Groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupAdminService: GroupAdminService) {}

  @Get()
  @ApiOperation({ summary: 'Get all groups info' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of groups',
    type: [GroupInfoResponseDto],
  })
  async getAllGroups(): Promise<GroupInfo[]> {
    // TODO: Implement getAllGroups in service
    return [];
  }

  @Get(':groupId')
  @ApiOperation({ summary: 'Get group info by ID' })
  @ApiParam({ name: 'groupId', description: 'Group ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns group info',
    type: GroupInfoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async getGroupInfo(
    @Param('groupId') groupId: string,
  ): Promise<GroupInfo | null> {
    return this.groupAdminService.getGroupInfo(groupId);
  }

  @Get(':groupId/stats')
  @ApiOperation({ summary: 'Get group statistics' })
  @ApiParam({ name: 'groupId', description: 'Group ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns group statistics',
    type: GroupStatsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async getGroupStats(
    @Param('groupId') groupId: string,
  ): Promise<GroupStatsResponseDto | null> {
    return this.groupAdminService.getGroupStats(groupId);
  }

  @Put(':groupId/settings')
  @ApiOperation({ summary: 'Update group settings' })
  @ApiParam({ name: 'groupId', description: 'Group ID' })
  @ApiResponse({
    status: 200,
    description: 'Settings updated successfully',
    type: GroupInfoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async updateGroupSettings(
    @Param('groupId') groupId: string,
    @Body() settings: UpdateGroupSettingsDto,
  ): Promise<GroupInfo> {
    return this.groupAdminService.updateGroupSettings(groupId, settings);
  }

  @Put(':groupId/members/:userId/role')
  @ApiOperation({ summary: 'Update member role' })
  @ApiParam({ name: 'groupId', description: 'Group ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Group or user not found' })
  async updateMemberRole(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Body() { role }: UpdateMemberRoleDto,
  ): Promise<SuccessResponseDto> {
    await this.groupAdminService.updateMemberRole(groupId, userId, role);
    return { success: true };
  }

  @Delete(':groupId/members/:userId')
  @ApiOperation({ summary: 'Kick member from group' })
  @ApiParam({ name: 'groupId', description: 'Group ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Member kicked successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Group or user not found' })
  async kickMember(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ): Promise<SuccessResponseDto> {
    await this.groupAdminService.kickMember(groupId, userId);
    return { success: true };
  }
}
