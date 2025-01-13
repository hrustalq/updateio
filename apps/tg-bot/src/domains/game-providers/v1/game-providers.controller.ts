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
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@repo/database';

@ApiTags('Game Providers')
@Controller({
  path: 'game-providers',
  version: '1',
})
export class GameProvidersController {
  constructor(private readonly gameProvidersService: GameProvidersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new game provider' })
  @ApiResponse({ type: GameProviderDto, status: 201 })
  create(@Body() createGameProviderDto: CreateGameProviderDto) {
    return this.gameProvidersService.create(createGameProviderDto);
  }

  @Get()
  @Public()
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
  @Public()
  @ApiOperation({ summary: 'Get a game provider by id' })
  @ApiResponse({ type: GameProviderDto })
  @Cache({ namespace: 'game-providers', key: (req) => req.params.id })
  findOne(@Param('id') id: string) {
    return this.gameProvidersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a game provider' })
  @ApiResponse({ type: GameProviderDto })
  update(
    @Param('id') id: string,
    @Body() updateGameProviderDto: UpdateGameProviderDto,
  ) {
    return this.gameProvidersService.update(id, updateGameProviderDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a game provider' })
  @ApiResponse({ type: GameProviderDto })
  remove(@Param('id') id: string) {
    return this.gameProvidersService.remove(id);
  }
}
