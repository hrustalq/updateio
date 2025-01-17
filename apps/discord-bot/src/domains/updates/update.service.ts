import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Partitioners } from 'kafkajs';
import { Message, Embed } from 'discord.js';

interface GameUpdate {
  title: string;
  gameName: string;
  content: string;
  sourceUrl: string;
  timestamp: Date;
  version?: string;
  rawContent?: string;
}

interface UpdateChange {
  category: string;
  changes: string[];
}

@Injectable()
export class UpdateService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UpdateService.name);
  private producer: Producer;
  private readonly PATCHBOT_ID = '1289896923813253212';

  constructor(private readonly configService: ConfigService) {
    const kafka = new Kafka({
      clientId: this.configService.get('app.kafka.clientId'),
      brokers: this.configService.get('app.kafka.brokers'),
    });
    this.producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }

  async onModuleInit() {
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async handleMessage(message: Message) {
    if (
      !message.embeds?.length ||
      !message.author.bot ||
      message.author.id !== this.PATCHBOT_ID
    ) {
      return;
    }

    const embed = message.embeds[0];

    try {
      const updateData = this.parseGameUpdate(message, embed);

      if (!updateData) {
        this.logger.warn(`Failed to parse update from message ${message.id}`);
        return;
      }

      await this.sendGameUpdate(updateData);
      this.logger.log(
        `Successfully processed update for ${updateData.gameName}`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing message ${message.id}: ${error.message}`,
        error.stack,
      );
    }
  }

  private parseGameUpdate(message: Message, embed: Embed): GameUpdate {
    const gameName = embed.data.author?.name || 'Unknown Game';
    const timestamp = message.createdAt;
    const sourceUrl = message.url;

    const versionMatch = embed.data.title?.match(
      /(?:Update|Patch(?:\s+Notes)?)\s*([\d.]+)/i,
    );
    const version = versionMatch ? versionMatch[1] : undefined;

    const changes: UpdateChange[] = [];
    let currentCategory = '';
    let currentChanges: string[] = [];

    const contentLines = embed.data.description?.split('\n') || [];

    for (const line of contentLines) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.includes('Gift PatchBot Premium')) {
        continue;
      }

      if (
        trimmedLine.endsWith(':') ||
        trimmedLine.match(/^[A-Z\s]{2,}$/) ||
        trimmedLine.match(/^#{1,3}\s+.+/)
      ) {
        if (currentCategory && currentChanges.length) {
          changes.push({
            category: currentCategory,
            changes: [...currentChanges],
          });
        }

        currentCategory = trimmedLine.replace(/[:#{}\s]+$/, '');
        currentChanges = [];
      } else if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        currentChanges.push(trimmedLine.replace(/^[•-]\s*/, ''));
      } else if (currentCategory) {
        currentChanges.push(trimmedLine);
      }
    }

    if (currentCategory && currentChanges.length) {
      changes.push({
        category: currentCategory,
        changes: currentChanges,
      });
    }

    return {
      title: embed.data.title || 'Unknown Update',
      gameName,
      content: embed.data.description || '',
      sourceUrl,
      timestamp,
      version,
      rawContent: message.content,
    };
  }

  async sendGameUpdate(updateData: GameUpdate) {
    try {
      await this.producer.send({
        topic: 'game.updates',
        messages: [
          {
            key: updateData.gameName,
            value: JSON.stringify({
              ...updateData,
              source: 'discord',
              timestamp: updateData.timestamp.toISOString(),
            }),
          },
        ],
      });

      this.logger.log(`Game update sent to Kafka: ${updateData.gameName}`);
    } catch (error) {
      this.logger.error(
        `Failed to send game update to Kafka: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
