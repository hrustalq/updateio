import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubscriptionsV1Service } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionDto } from './dto/subscription.dto';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';

@ApiTags('Subscriptions')
@Controller({ path: 'subscriptions', version: '1' })
export class SubscriptionsV1Controller {
  constructor(private readonly subscriptionsService: SubscriptionsV1Service) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({ type: SubscriptionDto, status: 201 })
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscriptions' })
  @ApiResponse({
    status: 200,
    description: 'Returns all subscriptions',
    isArray: true,
    type: SubscriptionDto,
  })
  findAll(@Query('userId') userId?: string, @Query('gameId') gameId?: string) {
    if (userId) {
      return this.subscriptionsService.findByUser(userId);
    }
    if (gameId) {
      return this.subscriptionsService.findByGame(gameId);
    }
    return this.subscriptionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subscription by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns the subscription',
    type: SubscriptionDto,
  })
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscription' })
  @ApiResponse({
    status: 200,
    description: 'The subscription has been successfully updated.',
    type: SubscriptionDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subscription' })
  @ApiResponse({
    status: 200,
    description: 'The subscription has been successfully deleted.',
    type: SubscriptionDto,
  })
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(id);
  }
}
