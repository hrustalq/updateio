import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommandDto {
  @ApiProperty({
    description: 'The unique identifier of the update command',
    example: 'clrk2345600000123jk5678',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the game this command is for',
    example: 'clrk2345600000123jk5679',
    required: false,
  })
  gameId?: string;

  @ApiProperty({
    description: 'The command to execute for updating',
    example: 'steamcmd +login anonymous +app_update 730 +quit',
  })
  command: string;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
