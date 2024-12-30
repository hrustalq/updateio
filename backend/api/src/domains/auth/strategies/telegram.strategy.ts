import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class TelegramStrategy extends PassportStrategy(Strategy, 'telegram') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request) {
    const isValid = await this.authService.validateTelegramAuth(req.body);
    if (!isValid) {
      return false;
    }
    return req.body;
  }
}
