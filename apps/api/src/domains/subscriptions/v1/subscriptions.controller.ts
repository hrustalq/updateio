import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SubscriptionsV1Service } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionDto } from './dto/subscription.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { SortingQueryDto } from '../../../common/dto/sorting-query.dto';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';
import { Auth, AuthType } from '../../../common/decorators/auth.decorator';
import { GetUser } from '../../../common/decorators/user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@repo/database';
import { Cache } from '../../../common/decorators/cache.decorator';
import { User } from '../../users/v1/interfaces/user.interface';
import { CreateGroupSubscriptionDto } from './dto/create-group-subscription.dto';
import { GroupSubscriptionDto } from './dto/group-subscription.dto';

@ApiTags('Subscriptions')
@Controller({
  path: 'subscriptions',
  version: '1',
})
export class SubscriptionsV1Controller {
  constructor(private readonly subscriptionsService: SubscriptionsV1Service) {}

  @Post()
  @Auth({ type: AuthType.Bearer })
  @ApiOperation({ summary: 'Create new subscriptions for current user' })
  @ApiResponse({ type: SubscriptionDto, isArray: true, status: 201 })
  create(
    @GetUser() user: User,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.create(user.id, createSubscriptionDto);
  }

  @Get()
  @Auth({ type: AuthType.Bearer })
  @ApiOperation({ summary: 'Get current user subscriptions' })
  @ApiResponse({ type: SubscriptionDto, isArray: true })
  @Cache({ namespace: 'subscriptions', key: (req) => req.user?.id })
  findUserSubscriptions(
    @GetUser() user: User,
    @Query() paginationQuery: PaginationQueryDto,
    @Query() sortingQuery: SortingQueryDto<SubscriptionDto>,
  ) {
    return this.subscriptionsService.findUserSubscriptions(
      user.id,
      paginationQuery,
      sortingQuery,
    );
  }

  @Get('admin/users/:userId')
  @Auth({ type: AuthType.Bearer })
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get user subscriptions (Admin)' })
  @ApiResponse({ type: SubscriptionDto, isArray: true })
  @Cache({
    namespace: 'admin-user-subscriptions',
    key: (req) => req.params.userId,
  })
  findUserSubscriptionsAdmin(
    @Param('userId') userId: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Query() sortingQuery: SortingQueryDto<SubscriptionDto>,
  ) {
    return this.subscriptionsService.findUserSubscriptionsAdmin(
      userId,
      paginationQuery,
      sortingQuery,
    );
  }

  @Post('admin/users/:userId')
  @Auth({ type: AuthType.Bearer })
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create user subscriptions (Admin)' })
  @ApiResponse({ type: SubscriptionDto, isArray: true, status: 201 })
  createUserSubscriptionsAdmin(
    @Param('userId') userId: string,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.createUserSubscriptionsAdmin(
      userId,
      createSubscriptionDto,
    );
  }

  @Delete('admin/:id')
  @Auth({ type: AuthType.Bearer })
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete subscription (Admin)' })
  @ApiResponse({ type: SubscriptionDto })
  removeSubscriptionAdmin(@Param('id') id: string) {
    return this.subscriptionsService.removeSubscriptionAdmin(id);
  }

  @Delete(':id')
  @Auth({ type: AuthType.Bearer })
  @ApiOperation({ summary: 'Delete subscription' })
  @ApiResponse({ type: SubscriptionDto })
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.subscriptionsService.remove(user.id, id);
  }

  @Delete('admin/:id')
  @Auth({ type: AuthType.Bearer })
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete any subscription (admin only)' })
  @ApiResponse({ type: SubscriptionDto })
  removeAdmin(@Param('id') id: string) {
    return this.subscriptionsService.removeAdmin(id);
  }

  @Post('groups/:groupId')
  @Auth({ type: AuthType.Bearer })
  @ApiOperation({ summary: 'Create new subscriptions for a group' })
  @ApiResponse({ type: GroupSubscriptionDto, isArray: true, status: 201 })
  createGroupSubscription(
    @GetUser() user: User,
    @Param('groupId') groupId: string,
    @Body() createGroupSubscriptionDto: CreateGroupSubscriptionDto,
  ) {
    return this.subscriptionsService.createGroupSubscription(
      user.id,
      groupId,
      createGroupSubscriptionDto,
    );
  }

  @Get('groups/:groupId')
  @Auth({ type: AuthType.Bearer })
  @ApiOperation({ summary: 'Get group subscriptions' })
  @ApiResponse({ type: GroupSubscriptionDto, isArray: true })
  @Cache({ namespace: 'group-subscriptions', key: (req) => req.params.groupId })
  findGroupSubscriptions(
    @GetUser() user: User,
    @Param('groupId') groupId: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Query() sortingQuery: SortingQueryDto<GroupSubscriptionDto>,
  ) {
    return this.subscriptionsService.findGroupSubscriptions(
      user.id,
      groupId,
      paginationQuery,
      sortingQuery,
    );
  }

  @Delete('groups/:groupId/subscriptions/:id')
  @Auth({ type: AuthType.Bearer })
  @ApiOperation({ summary: 'Delete group subscription' })
  @ApiResponse({ type: GroupSubscriptionDto })
  removeGroupSubscription(
    @GetUser() user: User,
    @Param('groupId') groupId: string,
    @Param('id') id: string,
  ) {
    return this.subscriptionsService.removeGroupSubscription(
      user.id,
      groupId,
      id,
    );
  }
}
