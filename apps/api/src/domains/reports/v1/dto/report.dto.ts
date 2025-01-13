import { ApiProperty } from '@nestjs/swagger';

export class ReportDto {
  @ApiProperty({
    description: 'The unique identifier of the report',
    example: 'clrk2345600000123jk5678',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the user who created the report',
    example: 'clrk2345600000123jk5679',
  })
  userId: string;

  @ApiProperty({
    description: 'Content of the report',
    example: 'Game update failed to install properly',
  })
  content: string;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
