import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../../common/modules/cache/cache.service';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import { compare } from 'bcrypt';
import { UsersV1Service as UsersService } from '../../users/v1/users.service';
import { JwtPayload } from './interfaces/jwt-payload.intrerface';
import { Tokens } from './interfaces/tokens.interface';
import { Response } from 'express';
import { JwtDto } from './dto/jwt.dto';
import { TimeUtil } from '../../../common/utils/time.util';
import { TokenVerificationDto } from './dto/token-verification.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User, UserRole } from '@repo/database';

@Injectable()
export class AuthService {
  private readonly BLACKLIST_PREFIX = 'token:blacklist:';
  private readonly REFRESH_PREFIX = 'refresh:';
  private readonly REFRESH_COOKIE_NAME = 'refresh_token';

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly usersService: UsersService,
  ) {}

  async validateTelegramAuth(authData: TelegramAuthDto): Promise<boolean> {
    const botToken = this.configService.get('auth.telegram.botToken');
    const dataCheckString = this.buildDataCheckString(authData);
    const secretKey = createHash('sha256').update(botToken).digest();
    const hash = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return hash === authData.hash;
  }

  async login(userId: string, res: Response): Promise<JwtDto> {
    const tokens = await this.getTokens(userId);
    await this.updateRefreshToken(userId, tokens.refresh_token);

    this.setRefreshTokenCookie(res, tokens.refresh_token);

    const expiresIn = TimeUtil.getExpiresInSeconds(
      this.configService.get('auth.jwt.accessExpiresIn'),
    );

    return {
      access_token: tokens.access_token,
      expires_in: expiresIn,
      issued_at: Math.floor(Date.now() / 1000),
    };
  }

  async logout(userId: string, token: string, res: Response): Promise<void> {
    await this.cacheService.delete(`${this.REFRESH_PREFIX}${userId}`);
    await this.blacklistToken(token, this.getTokenExpiryTime(token));
    this.clearRefreshTokenCookie(res);
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
    res: Response,
  ): Promise<JwtDto> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const storedRefreshToken = await this.cacheService.get<string>(
      `${this.REFRESH_PREFIX}${userId}`,
    );

    if (storedRefreshToken !== refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(userId);
    await this.updateRefreshToken(userId, tokens.refresh_token);

    this.setRefreshTokenCookie(res, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
      expires_in: this.configService.get('auth.jwt.accessExpiresIn'),
      issued_at: Math.floor(Date.now() / 1000),
    };
  }

  private async getTokens(userId: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id: userId },
        {
          expiresIn: this.configService.get('auth.jwt.accessExpiresIn'),
          secret: this.configService.get('auth.jwt.secret'),
        },
      ),
      this.jwtService.signAsync(
        { id: userId },
        {
          expiresIn: this.configService.get('auth.jwt.refreshExpiresIn'),
          secret: this.configService.get('auth.jwt.refreshSecret'),
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const ttl = this.getTokenExpiryTime(refreshToken);
    await this.cacheService.set(
      `${this.REFRESH_PREFIX}${userId}`,
      refreshToken,
      ttl,
    );
  }

  private getTokenExpiryTime(token: string): number {
    const decoded = this.jwtService.decode(token) as JwtPayload;
    if (!decoded?.exp) {
      throw new UnauthorizedException('Invalid token');
    }
    return decoded.exp - Math.floor(Date.now() / 1000);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklisted = await this.cacheService.get<boolean>(
      this.BLACKLIST_PREFIX + token,
    );
    return !!blacklisted;
  }

  private async blacklistToken(
    token: string,
    timeToExpiry: number,
  ): Promise<void> {
    await this.cacheService.set(
      this.BLACKLIST_PREFIX + token,
      true,
      timeToExpiry,
    );
  }

  private buildDataCheckString(data: TelegramAuthDto): string {
    const checkArr = Object.entries(data)
      .filter(([key]) => key !== 'hash')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`);

    return checkArr.join('\n');
  }

  async validateUser(email: string, password: string) {
    let user: User | null = null;
    try {
      user = await this.usersService.findOneByEmail(email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
      throw error;
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...result } = user;
    return result;
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    const isDev = this.configService.get('NODE_ENV') === 'development';

    res.cookie(this.REFRESH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: isDev ? 'none' : 'lax',
      expires: new Date(
        Date.now() +
          TimeUtil.parseDuration(
            this.configService.get('auth.jwt.refreshExpiresIn'),
          ),
      ),
      maxAge: TimeUtil.parseDuration(
        this.configService.get('auth.jwt.refreshExpiresIn'),
      ),
      path: '/', // Allow cookie for all paths in development
    });
  }

  private clearRefreshTokenCookie(res: Response): void {
    const isDev = this.configService.get('NODE_ENV') === 'development';

    res.clearCookie(this.REFRESH_COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: isDev ? 'none' : 'lax',
      path: '/',
    });
  }

  async verifyToken(token: string): Promise<TokenVerificationDto> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const isBlacklisted = await this.isTokenBlacklisted(token);

      if (isBlacklisted) {
        throw new UnauthorizedException('Token is blacklisted');
      }

      return {
        issued_at: payload.iat,
        expires_in: payload.exp,
        user_id: payload.id,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getCurrentUser(user: Omit<User, 'password'>): Promise<UserResponseDto> {
    return {
      id: user.id,
      telegramId: user.telegramId,
      role: user.role,
    };
  }

  async findOrCreateTelegramUser(
    telegramAuthDto: TelegramAuthDto,
  ): Promise<User> {
    try {
      const user = await this.usersService.findByTelegramId(
        telegramAuthDto.id.toString(),
      );
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return this.usersService.create({
          telegramId: telegramAuthDto.id.toString(),
          role: UserRole.USER,
        });
      }
      throw error;
    }
  }
}
