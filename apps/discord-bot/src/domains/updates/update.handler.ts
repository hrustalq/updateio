import { Injectable, Logger } from '@nestjs/common';
import { Message } from 'discord.js';
import { UpdateService } from './update.service';
import { MetricsService } from '../../infrastructure/monitoring/metrics.service';

interface DetectedUpdate {
  isUpdate: boolean;
  title?: string;
  gameName?: string;
  updateLink?: string;
}

@Injectable()
export class UpdateHandler {
  private readonly logger = new Logger(UpdateHandler.name);
  constructor(
    private readonly updateService: UpdateService,
    private readonly metricsService: MetricsService,
  ) {}

  async handleMessage(message: Message) {
    // Skip messages from bots and system messages
    if (
      !message.author.bot ||
      !message.content ||
      message.author.id !== '1289896923813253212'
    ) {
      return;
    }

    const startTime = process.hrtime();
    const detectedUpdate = this.detectGameUpdate(message);

    if (
      detectedUpdate.isUpdate &&
      detectedUpdate.gameName &&
      detectedUpdate.updateLink
    ) {
      const update = {
        gameName: detectedUpdate.gameName,
        title: detectedUpdate.title || 'No title',
        content: message.content,
        updateLink: detectedUpdate.updateLink,
        timestamp: new Date(),
        channelId: message.channelId,
        messageId: message.id,
        sourceUrl: detectedUpdate.updateLink,
      };

      try {
        this.updateService.sendGameUpdate(update);
        this.logger.log(
          `Detected and sent update for game: ${update.gameName}`,
        );

        // Track successful update
        this.metricsService.trackUpdate(update.gameName);

        // Track processing duration
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const duration = seconds + nanoseconds / 1e9;
        this.metricsService.trackUpdateDuration(update.gameName, duration);
      } catch (error) {
        this.logger.error(
          `Failed to send update for game ${update.gameName}:`,
          error,
        );
        this.metricsService.trackUpdateError(
          update.gameName,
          error.name || 'UnknownError',
        );
      }
    }
  }

  private detectGameUpdate(message: Message): DetectedUpdate {
    const content = message.content.toLowerCase();
    const updateKeywords = ['update', 'patch', 'release', 'version', 'notes'];

    // Check if this is an update message
    const isUpdateMessage = updateKeywords.some((keyword) =>
      content.includes(keyword),
    );

    if (!isUpdateMessage) {
      return { isUpdate: false };
    }

    // Extract title - usually the first line
    const lines = message.content.split('\n');
    const title = lines[0].trim();

    // Extract game name from title
    // Game names are usually at the start of the title before keywords like "Update", "Patch", etc.
    const gameNameMatch = title.match(
      /^(.*?)\s*(?:Update|Patch|Release|Version|Notes)/i,
    );
    const gameName = gameNameMatch ? gameNameMatch[1].trim() : null;

    // Extract update link - look for URLs in the content
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.content.match(urlRegex);
    const updateLink = urls ? urls[0] : null;

    if (!gameName || !updateLink) {
      this.logger.warn(`Incomplete update detection in message ${message.id}:
        Game Name: ${gameName || 'Not found'}
        Update Link: ${updateLink || 'Not found'}
      `);
    }

    return {
      isUpdate: true,
      title,
      gameName,
      updateLink,
    };
  }
}
