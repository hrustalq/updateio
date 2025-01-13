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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GamesV1Service } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameDto } from './dto/game.dto';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';

@ApiTags('Games')
@Controller({ path: 'games', version: '1' })
export class GamesV1Controller {
  constructor(private readonly gamesService: GamesV1Service) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({ type: GameDto, status: 201 })
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all games' })
  @ApiResponse({
    status: 200,
    description: 'Returns all games',
    isArray: true,
    type: GameDto,
  })
  findAll(@Query('providerId') providerId?: string) {
    if (providerId) {
      return this.gamesService.findByProvider(providerId);
    }
    return this.gamesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a game by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns the game',
    type: GameDto,
  })
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a game' })
  @ApiResponse({
    status: 200,
    description: 'The game has been successfully updated.',
    type: GameDto,
  })
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a game' })
  @ApiResponse({
    status: 200,
    description: 'The game has been successfully deleted.',
    type: GameDto,
  })
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }
}
