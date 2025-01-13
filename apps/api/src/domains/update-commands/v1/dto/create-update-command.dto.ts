import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUpdateCommandDto {
  @ApiProperty({
    description: 'ID of the game this command is for',
    example: 'clrk2345600000123jk5679',
    required: false,
  })
  @IsString()
  @IsOptional()
  gameId?: string;

  @ApiProperty({
    description: 'The command to execute for updating',
    example: 'steamcmd +login anonymous +app_update 730 +quit',
  })
  @IsString()
  @IsNotEmpty()
  command: string;
}
