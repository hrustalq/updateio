import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiResponse } from '../common/decorators/api-response.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ExampleDto } from './dto/example.dto';
import { CreateExampleDto } from './dto/create-example.dto';
import { FindOneParamsDto } from '../common/dto/find-one-params.dto';
import { PaginationHelper } from '../common/helpers/pagination.helper';
import { SortingQueryDto } from '../common/dto/sorting-query.dto';
import { HttpCacheInterceptor } from '../common/interceptors/cache.interceptor';
import { CacheService } from 'src/common/modules/cache/cache.service';

@ApiTags('Example')
@Controller({
  version: '1',
  path: 'example',
})
@UseInterceptors(HttpCacheInterceptor)
export class ExampleController {
  constructor(private readonly cacheService: CacheService) {}

  @Get()
  @ApiResponse({
    type: ExampleDto,
    isArray: true,
    description: 'Returns list of examples',
    includeErrors: true,
  })
  findAll(
    @Query() query: PaginationQueryDto,
    @Query() sortQuery: SortingQueryDto<ExampleDto>,
  ) {
    const examples = [
      { id: 1, name: 'Example 1', createdAt: '2024-01-01' },
      { id: 2, name: 'Example 2', createdAt: '2024-01-02' },
      { id: 3, name: 'Example 3', createdAt: '2024-01-03' },
      { id: 4, name: 'Example 4', createdAt: '2024-01-04' },
      { id: 5, name: 'Example 5', createdAt: '2024-01-05' },
    ];

    return PaginationHelper.paginate(examples, {
      page: query.page,
      limit: query.limit,
      sort: sortQuery.sort,
    });
  }

  @Get(':id')
  @ApiNotFoundResponse({
    description: 'Example with specified ID was not found',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Example not found' },
        error: { type: 'string', example: 'Not Found' },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    type: ExampleDto,
    description: 'Returns single example',
  })
  findOne(@Param() params: FindOneParamsDto) {
    if (params.id > 5) {
      throw new NotFoundException(`Example with id ${params.id} not found`);
    }
    return { id: params.id, name: `Example ${params.id}` };
  }

  @Post()
  @ApiResponse({
    type: ExampleDto,
    status: 201,
    description: 'Creates new example',
    includeErrors: true,
  })
  async create(@Body() createExampleDto: CreateExampleDto) {
    const result = {
      id: Math.floor(Math.random() * 1000) + 1,
      name: createExampleDto.name,
    };

    await this.cacheService.delete('examples-list');
    return result;
  }
}
