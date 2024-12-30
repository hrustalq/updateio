import { ApiProperty } from '@nestjs/swagger';

export class CreateExampleDto {
  @ApiProperty({
    description: 'The name of the example',
    example: 'Example 1',
    type: 'string',
  })
  name: string;
}
