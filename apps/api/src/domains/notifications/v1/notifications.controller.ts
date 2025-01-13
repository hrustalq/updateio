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
import { NotificationsV1Service } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';
import { NotificationType } from '@repo/database';

@ApiTags('Notifications')
@Controller({ path: 'notifications', version: '1' })
export class NotificationsV1Controller {
  constructor(private readonly notificationsService: NotificationsV1Service) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ type: NotificationDto, status: 201 })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({
    status: 200,
    description: 'Returns all notifications',
    isArray: true,
    type: NotificationDto,
  })
  findAll(
    @Query('userId') userId?: string,
    @Query('type') type?: NotificationType,
  ) {
    if (userId) {
      return this.notificationsService.findByUser(userId);
    }
    if (type) {
      return this.notificationsService.findByType(type);
    }
    return this.notificationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a notification by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns the notification',
    type: NotificationDto,
  })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a notification' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully updated.',
    type: NotificationDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully deleted.',
    type: NotificationDto,
  })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
