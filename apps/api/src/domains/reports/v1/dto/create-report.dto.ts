import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    description: 'ID of the user creating the report',
    example: 'clrk2345600000123jk5679',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Content of the report',
    example: 'Game update failed to install properly',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
