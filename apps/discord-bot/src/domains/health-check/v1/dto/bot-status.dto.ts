import { IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BotStatusDto {
  @ApiProperty({
    enum: ['online', 'offline'],
    description: 'Current bot connection status',
  })
  @IsString()
  status: 'online' | 'offline';

  @ApiProperty({
    description: 'Bot uptime in seconds',
    example: 3600,
  })
  @IsNumber()
  uptime: number;

  @ApiProperty({
    description: 'Bot start timestamp',
    example: new Date().toISOString(),
  })
  @IsDate()
  startedAt: Date;
}

export class BotRestartDto {
  @ApiProperty({
    description: 'Restart operation result message',
    example: 'Bot restarted successfully',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'New bot start timestamp',
    example: new Date().toISOString(),
  })
  @IsDate()
  startedAt: Date;
}

export class BotLogsDto {
  @ApiProperty({
    description: 'Log retrieval message or actual logs',
    example:
      'Logs functionality will be implemented with proper logging service',
  })
  @IsString()
  message: string;
}
