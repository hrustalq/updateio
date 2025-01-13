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
import { UpdateCommandsV1Service } from './update-commands.service';
import { CreateUpdateCommandDto } from './dto/create-update-command.dto';
import { UpdateUpdateCommandDto } from './dto/update-update-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';

@ApiTags('Update Commands')
@Controller({ path: 'update-commands', version: '1' })
export class UpdateCommandsV1Controller {
  constructor(
    private readonly updateCommandsService: UpdateCommandsV1Service,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new update command' })
  @ApiResponse({ type: UpdateCommandDto, status: 201 })
  create(@Body() createUpdateCommandDto: CreateUpdateCommandDto) {
    return this.updateCommandsService.create(createUpdateCommandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all update commands' })
  @ApiResponse({
    status: 200,
    description: 'Returns all update commands',
    isArray: true,
    type: UpdateCommandDto,
  })
  findAll(@Query('gameId') gameId?: string) {
    if (gameId) {
      return this.updateCommandsService.findByGame(gameId);
    }
    return this.updateCommandsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an update command by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns the update command',
    type: UpdateCommandDto,
  })
  findOne(@Param('id') id: string) {
    return this.updateCommandsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an update command' })
  @ApiResponse({
    status: 200,
    description: 'The update command has been successfully updated.',
    type: UpdateCommandDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateUpdateCommandDto: UpdateUpdateCommandDto,
  ) {
    return this.updateCommandsService.update(id, updateUpdateCommandDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an update command' })
  @ApiResponse({
    status: 200,
    description: 'The update command has been successfully deleted.',
    type: UpdateCommandDto,
  })
  remove(@Param('id') id: string) {
    return this.updateCommandsService.remove(id);
  }
}
