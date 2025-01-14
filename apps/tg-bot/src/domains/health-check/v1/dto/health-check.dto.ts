import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class HealthCheckDto {
  @ApiProperty({ example: 'ok' })
  @IsString()
  status: string;

  @ApiProperty({ example: '2024-01-14T12:00:00.000Z' })
  @IsDateString()
  timestamp: string;

  @ApiProperty({ example: 'telegram-bot' })
  @IsString()
  service: string;
}

class DatabaseCheck {
  @ApiProperty({ example: 'up', enum: ['up', 'down'] })
  @IsString()
  database: string;
}

export class ReadinessCheckDto {
  @ApiProperty({ example: 'ok', enum: ['ok', 'error'] })
  @IsString()
  status: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => DatabaseCheck)
  checks: DatabaseCheck;

  @ApiProperty({ example: '2024-01-14T12:00:00.000Z' })
  @IsDateString()
  timestamp: string;
}

export class LivenessCheckDto {
  @ApiProperty({ example: 'ok' })
  @IsString()
  status: string;

  @ApiProperty({ example: '2024-01-14T12:00:00.000Z' })
  @IsDateString()
  timestamp: string;
}
