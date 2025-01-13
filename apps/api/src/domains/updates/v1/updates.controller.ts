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
import { UpdatesV1Service } from './updates.service';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';
import { UpdateDto } from './dto/update.dto';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';

@ApiTags('Updates')
@Controller({ path: 'updates', version: '1' })
export class UpdatesV1Controller {
  constructor(private readonly updatesService: UpdatesV1Service) {}

  @Post()
  @ApiOperation({ summary: 'Create a new update' })
  @ApiResponse({ type: UpdateDto, status: 201 })
  create(@Body() createUpdateDto: CreateUpdateDto) {
    return this.updatesService.create(createUpdateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all updates' })
  @ApiResponse({
    status: 200,
    description: 'Returns all updates',
    isArray: true,
    type: UpdateDto,
  })
  findAll(@Query('gameId') gameId?: string) {
    if (gameId) {
      return this.updatesService.findByGame(gameId);
    }
    return this.updatesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an update by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns the update',
    type: UpdateDto,
  })
  findOne(@Param('id') id: string) {
    return this.updatesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an update' })
  @ApiResponse({
    status: 200,
    description: 'The update has been successfully updated.',
    type: UpdateDto,
  })
  update(@Param('id') id: string, @Body() updateUpdateDto: UpdateUpdateDto) {
    return this.updatesService.update(id, updateUpdateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an update' })
  @ApiResponse({
    status: 200,
    description: 'The update has been successfully deleted.',
    type: UpdateDto,
  })
  remove(@Param('id') id: string) {
    return this.updatesService.remove(id);
  }
}
