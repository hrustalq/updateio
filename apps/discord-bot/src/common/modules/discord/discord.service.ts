import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, Message } from 'discord.js';
import { GameUpdate } from '../../types/game-update.type';

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly logger = new Logger(DiscordService.name);
  public readonly client: Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.client.on('ready', () => {
      this.logger.log(`Logged in as ${this.client.user?.tag}`);
    });

    this.client.on('messageCreate', (message) => {
      this.handleMessage(message).catch((error) => {
        this.logger.error('Error handling message:', error);
      });
    });

    this.client.on('error', (error) => {
      this.logger.error('Discord client error:', error);
    });
  }

  async onModuleInit() {
    const token = this.configService.get<string>('DISCORD_BOT_TOKEN');
    if (!token) {
      throw new Error(
        'DISCORD_BOT_TOKEN is not defined in environment variables',
      );
    }

    try {
      await this.client.login(token);
      this.logger.log('Discord client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Discord client:', error);
      throw error;
    }
  }

  async isReady(): Promise<boolean> {
    return this.client?.isReady() ?? false;
  }

  private async handleMessage(message: Message): Promise<void> {
    // Ignore messages from bots other than PatchBot
    if (message.author.bot && message.author.username !== 'PatchBot') {
      return;
    }

    // Check if message contains game update content
    if (this.isGameUpdate(message)) {
      const update = await this.parseGameUpdate(message);
      if (update) {
        await this.processGameUpdate(update);
      }
    }
  }

  private isGameUpdate(message: Message): boolean {
    // Check if message has an embed and contains specific game-related keywords
    return (
      message.embeds.length > 0 &&
      (message.embeds[0].title?.includes('Update') ||
        message.embeds[0].title?.includes('Patch Notes'))
    );
  }

  private async parseGameUpdate(message: Message): Promise<GameUpdate | null> {
    const embed = message.embeds[0];
    if (!embed || !embed.title) return null;

    // Extract game name from the first line or embed author
    const game = embed.author?.name || embed.title.split(' ')[0];

    return {
      game,
      title: embed.title,
      content: embed.description || '',
      timestamp: message.createdAt,
      messageId: message.id,
      channelId: message.channelId,
    };
  }

  private async processGameUpdate(update: GameUpdate): Promise<void> {
    this.logger.log(`Processing game update for ${update.game}`);
    // TODO: Save to database and emit RabbitMQ event
    // These will be implemented when we configure the database and message queue
  }

  public async fetchRecentMessages(
    channelId: string,
    limit = 10,
  ): Promise<GameUpdate[]> {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel?.isTextBased()) {
      throw new Error('Invalid channel or channel is not text-based');
    }

    const messages = await channel.messages.fetch({ limit });
    const updates: GameUpdate[] = [];

    for (const message of messages.values()) {
      if (this.isGameUpdate(message)) {
        const update = await this.parseGameUpdate(message);
        if (update) {
          updates.push(update);
        }
      }
    }

    return updates;
  }
}
