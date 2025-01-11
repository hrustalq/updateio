import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { TelegramAuthDto } from '../dto/telegram-auth.dto';

@Injectable()
export class TelegramGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const telegramData = request.body as TelegramAuthDto;

    const isValid = await this.authService.validateTelegramAuth(telegramData);
    if (!isValid) {
      throw new UnauthorizedException('Invalid Telegram authentication data');
    }

    return true;
  }
}
