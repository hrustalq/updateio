import { Controller, Post, Headers, Res, Req, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { ApiResponse } from '../../common/decorators/api-response.decorator';
import { JwtDto } from './dto/jwt.dto';
import { GetUser } from '../../common/decorators/user.decorator';
import { User } from '../users/interfaces/user.interface';
import { MessageResponseDto } from 'src/common/dto/message-response.dto';
import { TokenVerificationDto } from './dto/token-verification.dto';
import { Auth, AuthType } from '../../common/decorators/auth.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 201,
    description: 'Token refreshed successfully',
    type: JwtDto,
  })
  @ApiCookieAuth('refresh_token')
  @Auth({ type: AuthType.Bearer })
  @Post('refresh')
  async refreshTokens(
    @GetUser('id') userId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    return this.authService.refreshTokens(userId, refreshToken, res);
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 201,
    description: 'Successfully authenticated',
    type: JwtDto,
  })
  @Auth({ public: true, type: AuthType.Local })
  @Post('login')
  async login(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
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
