import {
  LoggerService as NestLoggerService,
  Injectable,
  ConsoleLogger,
} from '@nestjs/common';

@Injectable()
export class Logger extends ConsoleLogger implements NestLoggerService {
  constructor(context?: string) {
    super();
    this.setLogLevels(['warn', 'error', 'debug']);
    this.setContext(context);
  }

  log(message: string) {
    // Add custom log formatting or logic
    super.log(message);
  }

  error(message: string, stack: string) {
    // Add custom error handling
    super.error(message, stack);
  }

  warn(message: string) {
    // Add custom warning handling
    super.warn(message);
  }

  debug(message: string) {
    // Add custom debug handling
    super.debug(message);
  }

  verbose(message: string) {
    // Add custom verbose handling
    super.verbose(message);
  }
}
