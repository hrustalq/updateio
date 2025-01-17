import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('discord_bot_commands_total')
    private readonly commandCounter: Counter<string>,
    @InjectMetric('discord_bot_command_errors_total')
    private readonly commandErrors: Counter<string>,
    @InjectMetric('discord_bot_updates_processed_total')
    private readonly updatesProcessed: Counter<string>,
    @InjectMetric('discord_bot_update_errors_total')
    private readonly updateErrors: Counter<string>,
    @InjectMetric('discord_bot_command_duration_seconds')
    private readonly commandDuration: Histogram<string>,
    @InjectMetric('discord_bot_update_duration_seconds')
    private readonly updateDuration: Histogram<string>,
  ) {}

  // Command tracking
  trackCommand(command: string) {
    this.commandCounter.inc({ command });
  }

  trackCommandDuration(command: string, duration: number) {
    this.commandDuration.observe({ command }, duration);
  }

  trackCommandError(command: string, errorType: string) {
    this.commandErrors.inc({ command, error_type: errorType });
  }

  // Update tracking
  trackUpdate(game: string) {
    this.updatesProcessed.inc({ game });
  }

  trackUpdateDuration(game: string, duration: number) {
    this.updateDuration.observe({ game }, duration);
  }

  trackUpdateError(game: string, errorType: string) {
    this.updateErrors.inc({ game, error_type: errorType });
  }
}
