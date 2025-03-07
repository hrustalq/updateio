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
import { GameProvidersService } from './game-providers.service';
import { CreateGameProviderDto } from './dto/create-game-provider.dto';
import { UpdateGameProviderDto } from './dto/update-game-provider.dto';
import { GameProviderDto } from './dto/game-provider.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { SortingQueryDto } from '../../../common/dto/sorting-query.dto';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';
import { GameProvider } from '@repo/database';
import { Cache } from '../../../common/decorators/cache.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@repo/database';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from '../../../common/modules/minio/minio.service';

@ApiTags('Game Providers')
@Controller({
  path: 'game-providers',
  version: '1',
})
export class GameProvidersController {
  constructor(
    private readonly gameProvidersService: GameProvidersService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new game provider' })
  @ApiResponse({ type: GameProviderDto, status: 201 })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createGameProviderDto: CreateGameProviderDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    let image: string | undefined;

    if (imageFile) {
      const objectName = `game-providers/${Date.now()}-${imageFile.originalname}`;
      await this.minioService.uploadFile(imageFile, objectName);
      image = await this.minioService.getFileUrl(objectName);
    }

    return this.gameProvidersService.create({
      ...createGameProviderDto,
      image,
    });
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateGameProviderDto: UpdateGameProviderDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;

    if (imageFile) {
      const objectName = `game-providers/${Date.now()}-${imageFile.originalname}`;
      await this.minioService.uploadFile(imageFile, objectName);
      imageUrl = await this.minioService.getFileUrl(objectName);
    }

    return this.gameProvidersService.update(id, {
      ...updateGameProviderDto,
      ...(imageUrl && { imageUrl }),
    });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a game provider' })
  @ApiResponse({ type: GameProviderDto })
  remove(@Param('id') id: string) {
    return this.gameProvidersService.remove(id);
  }
}
