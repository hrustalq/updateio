import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({
    description: 'The message of the response',
    example: 'Success',
    type: 'string',
  })
  message: string;
}
