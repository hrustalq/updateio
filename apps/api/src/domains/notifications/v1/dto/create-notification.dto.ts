import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '@repo/database';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'ID of the user who receives the notification',
    example: 'clrk2345600000123jk5679',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'ID of the game update this notification is about',
    example: 'clrk2345600000123jk5680',
  })
  @IsString()
  @IsNotEmpty()
  gameUpdateId: string;

  @ApiProperty({
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.UPDATE,
  })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @ApiProperty({
    description: 'Content of the notification',
    example: 'New update available for Counter-Strike 2',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;
}
