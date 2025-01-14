import {
  Controller,
  Post,
  Headers,
  Res,
  Get,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';
import { JwtDto } from './dto/jwt.dto';
import { GetUser } from '../../../common/decorators/user.decorator';
import { MessageResponseDto } from '../../../common/dto/message-response.dto';
import { TokenVerificationDto } from './dto/token-verification.dto';
import { Auth, AuthType } from '../../../common/decorators/auth.decorator';
import { LoginDto } from './dto/local-auth.dto';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from '@repo/database';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user information',
    type: UserResponseDto,
  })
  @Auth({ type: AuthType.Bearer })
  @Get('me')
  async getCurrentUser(@GetUser() user: User): Promise<UserResponseDto> {
    return this.authService.getCurrentUser(user);
  }

  @ApiOperation({ summary: 'Refresh access token with refresh token in body' })
  @ApiResponse({
    status: 201,
    description: 'Token refreshed successfully',
    type: JwtDto,
  })
  @Auth({ public: true })
  @Post('token/refresh')
  async refreshToken(
    @Body('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user_id } = await this.authService.verifyToken(refreshToken);
    return this.authService.refreshTokens(user_id, refreshToken, res);
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 201,
    description: 'Successfully authenticated',
    type: JwtDto,
  })
  @ApiBody({ type: LoginDto })
  @Auth({ public: true, type: AuthType.Local })
  @Post('login')
  async login(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(user.id, res);
  }

  @ApiOperation({ summary: 'Login with Telegram' })
  @ApiResponse({
    status: 201,
    description: 'Successfully authenticated with Telegram',
    type: JwtDto,
  })
  @ApiBody({ type: TelegramAuthDto })
  @Auth({ public: true, type: AuthType.Telegram })
  @Post('telegram/login')
  async telegramLogin(
    @Body() telegramAuthDto: TelegramAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const isValid =
      await this.authService.validateTelegramAuth(telegramAuthDto);
    if (!isValid) {
      throw new UnauthorizedException('Invalid Telegram authentication data');
    }

    const user =
      await this.authService.findOrCreateTelegramUser(telegramAuthDto);
    return this.authService.login(user.id, res);
  }

  @ApiOperation({ summary: 'Logout current user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
    type: MessageResponseDto,
  })
  @Auth({ type: AuthType.Bearer })
  @Post('logout')
  async logout(
    @GetUser('id') userId: string,
    @Headers('authorization') auth: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = auth.replace('Bearer ', '');
    await this.authService.logout(userId, token, res);
    return { message: 'Successfully logged out' };
  }

  @ApiOperation({ summary: 'Verify access token' })
  @ApiResponse({
    status: 200,
    description: 'Token verification result',
    type: TokenVerificationDto,
  })
  @Auth({ type: AuthType.Bearer })
  @Get('verify')
  async verify(@Headers('authorization') auth: string) {
    const token = auth.replace('Bearer ', '');
    return this.authService.verifyToken(token);
  }
}
