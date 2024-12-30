import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class FindOneParamsDto {
  @ApiProperty({
    description: 'The unique identifier of the example',
    type: 'number',
    minimum: 1,
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;
}
