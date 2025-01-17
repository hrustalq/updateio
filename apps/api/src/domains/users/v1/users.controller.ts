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
import { UsersV1Service } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';
import { Auth } from '../../../common/decorators/auth.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@repo/database';
import { Cache } from '../../../common/decorators/cache.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { SortingQueryDto } from '../../../common/dto/sorting-query.dto';
import { AuthType } from '../../../common/decorators/auth.decorator';

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

  @Get('admin')
  @Auth({ type: AuthType.Bearer })
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin)' })
  @ApiResponse({ type: UserDto, isArray: true })
  @Cache({ namespace: 'admin-users' })
  findAllAdmin(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() sortingQuery: SortingQueryDto<UserDto>,
  ) {
    return this.usersService.findAllAdmin(paginationQuery, sortingQuery);
  }

  @Get('admin/:id')
  @Auth({ type: AuthType.Bearer })
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get user by ID (Admin)' })
  @ApiResponse({ type: UserDto })
  @Cache({ namespace: 'admin-user', key: (req) => req.params.id })
  findOneAdmin(@Param('id') id: string) {
    return this.usersService.findOneAdmin(id);
  }

  @Patch('admin/:id')
  @Auth({ type: AuthType.Bearer })
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user (Admin)' })
  @ApiResponse({ type: UserDto })
  updateAdmin(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateAdmin(id, updateUserDto);
  }

  @Delete('admin/:id')
  @Auth({ type: AuthType.Bearer })
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user (Admin)' })
  @ApiResponse({ type: UserDto })
  removeAdmin(@Param('id') id: string) {
    return this.usersService.removeAdmin(id);
  }
}
