import { ApiProperty } from '@nestjs/swagger';

export class ExampleDto {
  @ApiProperty({
    description: 'The unique identifier of the example',
    example: 1,
    type: 'number',
  })
  id: number;

  @ApiProperty({
    description: 'The name of the example',
    example: 'Example 1',
    type: 'string',
  })
  name: string;
}
