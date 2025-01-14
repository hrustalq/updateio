import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';
import { GetUser } from '../../../common/decorators/user.decorator';
import { User, UserRole } from '@repo/database';
import { Auth } from '../../../common/decorators/auth.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import {
  ApiKeyResponseDto,
  ApiKeyMessageDto,
} from './dto/api-key-response.dto';

@ApiTags('Authentication')
@Controller({
  version: '1',
  path: 'auth',
})
@Auth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user information',
    type: UserResponseDto,
  })
  @Get('me')
  async getCurrentUser(@GetUser() user: User): Promise<UserResponseDto> {
    return {
      id: user.id,
      telegramId: user.telegramId,
      role: user.role,
    };
  }

  @ApiOperation({ summary: 'Generate new API key' })
  @ApiResponse({
    status: 201,
    description: 'New API key generated successfully',
    type: ApiKeyResponseDto,
  })
  @Roles(UserRole.ADMIN)
  @Post('api-key/generate')
  async generateApiKey(
    @GetUser('id') userId: string,
  ): Promise<ApiKeyResponseDto> {
    return this.authService.generateApiKey(userId);
  }

  @ApiOperation({ summary: 'Revoke current API key' })
  @ApiResponse({
    status: 200,
    description: 'API key revoked successfully',
    type: ApiKeyMessageDto,
  })
  @Roles(UserRole.ADMIN)
  @Post('api-key/revoke')
  async revokeApiKey(@GetUser('id') userId: string): Promise<ApiKeyMessageDto> {
    await this.authService.revokeApiKey(userId);
    return { message: 'API key revoked successfully' };
  }
}
