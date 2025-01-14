import { Controller, Get, Post, Logger } from '@nestjs/common';
import { DiscordService } from '../../../common/modules/discord/discord.service';
import { Public } from '../../../common/decorators/public.decorator';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';
import { ApiTags } from '@nestjs/swagger';
import { BotStatusDto, BotRestartDto, BotLogsDto } from './dto/bot-status.dto';

@ApiTags('Bot Management')
@Controller({ path: 'bot', version: '1' })
export class HealthCheckController {
  private readonly logger = new Logger(HealthCheckController.name);
  private startTime: Date;

  constructor(private readonly discordService: DiscordService) {
    this.startTime = new Date();
  }

  @Get('status')
  @Public()
  @ApiResponse({
    type: BotStatusDto,
    description: 'Get current bot status and uptime',
  })
  async getStatus(): Promise<BotStatusDto> {
    const isReady = await this.discordService.isReady();
    const uptime = new Date().getTime() - this.startTime.getTime();

    return {
      status: isReady ? 'online' : 'offline',
      uptime: Math.floor(uptime / 1000),
      startedAt: this.startTime,
    };
  }

  @Post('restart')
  @Public()
  @ApiResponse({
    type: BotRestartDto,
    description: 'Restart the Discord bot',
    status: 201,
  })
  async restart(): Promise<BotRestartDto> {
    this.logger.log('Restarting Discord bot...');
    await this.discordService.onModuleInit();
    this.startTime = new Date();

    return {
      message: 'Bot restarted successfully',
      startedAt: this.startTime,
    };
  }

  @Get('logs')
  @Public()
  @ApiResponse({
    type: BotLogsDto,
    description: 'Get bot logs',
  })
  async getLogs(): Promise<BotLogsDto> {
    return {
      message:
        'Logs functionality will be implemented with proper logging service',
    };
  }
}
