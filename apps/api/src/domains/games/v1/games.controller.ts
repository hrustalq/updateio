import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { GamesV1Service } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameDto } from './dto/game.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { SortingQueryDto } from '../../../common/dto/sorting-query.dto';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';
import { Game } from '@repo/database';
import { Cache } from '../../../common/decorators/cache.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@repo/database';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from '../../../common/modules/minio/minio.service';

@ApiTags('Games')
@Controller({
  path: 'games',
  version: '1',
})
export class GamesV1Controller {
  constructor(
    private readonly gamesService: GamesV1Service,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({ type: GameDto, status: 201 })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createGameDto: CreateGameDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;

    if (imageFile) {
      const objectName = `games/${Date.now()}-${imageFile.originalname}`;
      await this.minioService.uploadFile(imageFile, objectName);
      imageUrl = await this.minioService.getFileUrl(objectName);
    }

    return this.gamesService.create({
      ...createGameDto,
      image: imageUrl,
    });
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all games' })
  @ApiResponse({ type: GameDto, isArray: true })
  @Cache({ namespace: 'games' })
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() sortingQuery: SortingQueryDto<Game>,
  ) {
    return this.gamesService.findAll(paginationQuery, sortingQuery);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a game by id' })
  @ApiResponse({ type: GameDto })
  @Cache({ namespace: 'games', key: (req) => req.params.id })
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a game' })
  @ApiResponse({ type: GameDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;

    if (imageFile) {
      const objectName = `games/${Date.now()}-${imageFile.originalname}`;
      await this.minioService.uploadFile(imageFile, objectName);
      imageUrl = await this.minioService.getFileUrl(objectName);
    }

    return this.gamesService.update(id, {
      ...updateGameDto,
      ...(imageUrl && { imageUrl }),
    });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a game' })
  @ApiResponse({ type: GameDto })
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }
}
