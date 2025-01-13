import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@repo/database';

export class NotificationDto {
  @ApiProperty({
    description: 'The unique identifier of the notification',
    example: 'clrk2345600000123jk5678',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the user who receives the notification',
    example: 'clrk2345600000123jk5679',
  })
  userId: string;

  @ApiProperty({
    description: 'ID of the game update this notification is about',
    example: 'clrk2345600000123jk5680',
  })
  gameUpdateId: string;

  @ApiProperty({
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.UPDATE,
  })
  type: NotificationType;

  @ApiProperty({
    description: 'Content of the notification',
    example: 'New update available for Counter-Strike 2',
    required: false,
  })
  content?: string;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
