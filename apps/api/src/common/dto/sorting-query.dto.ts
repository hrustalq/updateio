import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { SortOption, SortOrder } from '../interfaces/sorting.interface';

export class SortingQueryDto<T> {
  @ApiPropertyOptional({
    description: 'Sorting criteria in array format',
    example: ['name:ASC', 'createdAt:DESC'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ValidateIf((_, value) => Array.isArray(value))
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      return undefined;
    }
    const pattern = /^[a-zA-Z]+:(ASC|DESC)$/;
    const validItems = value.map(String).filter((item) => pattern.test(item));

    if (validItems.length !== value.length) {
      throw new Error(
        'Invalid sort format. Each element should be in format: field:ASC or field:DESC',
      );
    }

    return validItems;
  })
  @Transform(({ value }: { value: Array<keyof T> }) => {
    if (!value) return undefined;
    return value
      .map((sort: keyof T) => {
        const [field, order = 'asc'] = sort.toString().split(':');
        return { field: field as keyof T, order: order as SortOrder };
      })
      .filter((sort: SortOption<T>) => sort.field);
  })
  sort?: SortOption<T>[];
}
