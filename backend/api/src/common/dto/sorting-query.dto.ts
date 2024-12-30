import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { SortOption, SortOrder } from '../interfaces/sorting.interface';

export class SortingQueryDto<T> {
  @ApiPropertyOptional({
    description: 'Sorting criteria (format: field:order,field2:order2)',
    example: 'name:ASC,createdAt:DESC',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z]+(:(ASC|DESC))?(,[a-zA-Z]+(:(ASC|DESC))?)*$/, {
    message: 'Invalid sort format. Example: field:ASC,field2:DESC',
  })
  @Transform(({ value }) => {
    if (!value) return undefined;
    return value
      .split(',')
      .map((sort: string) => {
        const [field, order = 'ASC'] = sort.split(':');
        return { field, order: order as SortOrder };
      })
      .filter((sort: SortOption<T>) => sort.field);
  })
  sort?: SortOption<T>[];
}
