import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersV1Service } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UsersV1Controller {
  constructor(private readonly usersService: UsersV1Service) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ type: UserDto, status: 201 })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns all users',
    isArray: true,
    type: UserDto,
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('telegram/:telegramId')
  @ApiOperation({ summary: 'Get a user by telegram id' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user',
    type: UserDto,
  })
  findByTelegramId(@Param('telegramId') telegramId: string) {
    return this.usersService.findByTelegramId(telegramId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user',
    type: UserDto,
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UserDto,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
    type: UserDto,
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
