import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import HeaderAPIKeyStrategy from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'api-key',
) {
  constructor(private readonly authService: AuthService) {
    super(
      { header: 'X-API-KEY', prefix: '' },
      true,
      async (apiKey: string, done: any) => {
        return this.validate(apiKey, done);
      },
    );
  }

  async validate(apiKey: string, done: any) {
    const user = await this.authService.validateApiKey(apiKey);
    if (!user) {
      done(new UnauthorizedException(), null);
    }
    done(null, user);
  }
}
