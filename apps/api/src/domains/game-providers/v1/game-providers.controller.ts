import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GameProvidersService } from './game-providers.service';
import { CreateGameProviderDto } from './dto/create-game-provider.dto';
import { UpdateGameProviderDto } from './dto/update-game-provider.dto';
import { GameProviderDto } from './dto/game-provider.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { SortingQueryDto } from '../../../common/dto/sorting-query.dto';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';
import { GameProvider } from '@repo/database';
import { Cache } from '../../../common/decorators/cache.decorator';

@ApiTags('Game Providers')
@Controller('game-providers')
export class GameProvidersController {
  constructor(private readonly gameProvidersService: GameProvidersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game provider' })
  @ApiResponse({ type: GameProviderDto, status: 201 })
  create(@Body() createGameProviderDto: CreateGameProviderDto) {
    return this.gameProvidersService.create(createGameProviderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all game providers' })
  @ApiResponse({ type: GameProviderDto, isArray: true })
  @Cache({ namespace: 'game-providers' })
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() sortingQuery: SortingQueryDto<GameProvider>,
  ) {
    return this.gameProvidersService.findAll(paginationQuery, sortingQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a game provider by id' })
  @ApiResponse({ type: GameProviderDto })
  @Cache({ namespace: 'game-providers', key: (req) => req.params.id })
  findOne(@Param('id') id: string) {
    return this.gameProvidersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a game provider' })
  @ApiResponse({ type: GameProviderDto })
  update(
    @Param('id') id: string,
    @Body() updateGameProviderDto: UpdateGameProviderDto,
  ) {
    return this.gameProvidersService.update(id, updateGameProviderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a game provider' })
  @ApiResponse({ type: GameProviderDto })
  remove(@Param('id') id: string) {
    return this.gameProvidersService.remove(id);
  }
}
