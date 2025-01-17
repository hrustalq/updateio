import { Injectable, Logger } from '@nestjs/common';
import {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  REST,
  Routes,
  SlashCommandBuilder,
  version as discordVersion,
} from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { UpdateService } from '../updates/update.service';
import { cpus, uptime, freemem, totalmem } from 'os';
import { MetricsService } from '../../infrastructure/monitoring/metrics.service';

@Injectable()
export class CommandsService {
  private readonly logger = new Logger(CommandsService.name);
  private startTime: Date;
  private client: Client;

  private readonly commands = [
    new SlashCommandBuilder()
      .setName('scan-updates')
      .setDescription('Scan channel for game updates in a time range')
      .addStringOption((option) =>
        option
          .setName('from')
          .setDescription('Start date (YYYY-MM-DD)')
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('to')
          .setDescription('End date (YYYY-MM-DD), defaults to now')
          .setRequired(false),
      )
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Channel to scan, defaults to current channel')
          .setRequired(false),
      ),

    new SlashCommandBuilder()
      .setName('status')
      .setDescription('Show bot status and system information'),

    new SlashCommandBuilder()
      .setName('help')
      .setDescription('Show available commands and their usage'),

    new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Check bot latency'),
  ];

  constructor(
    private readonly configService: ConfigService,
    private readonly updateService: UpdateService,
    private readonly metricsService: MetricsService,
  ) {
    this.startTime = new Date();
  }

  async registerCommands(client: Client) {
    this.client = client;
    const rest = new REST().setToken(
      this.configService.get<string>('DISCORD_BOT_TOKEN'),
    );

    try {
      this.logger.log('Started refreshing application (/) commands.');

      await rest.put(Routes.applicationCommands(client.user.id), {
        body: this.commands,
      });

      this.logger.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      this.logger.error('Failed to reload application commands:', error);
    }
  }

  async handleCommand(interaction: ChatInputCommandInteraction) {
    if (!interaction.isCommand()) return;

    const commandName = interaction.commandName;
    const startTime = process.hrtime();

    try {
      this.metricsService.trackCommand(commandName);

      switch (commandName) {
        case 'scan-updates':
          await this.handleScanUpdates(interaction);
          break;
        case 'status':
          await this.handleStatus(interaction);
          break;
        case 'help':
          await this.handleHelp(interaction);
          break;
        case 'ping':
          await this.handlePing(interaction);
          break;
      }

      const [seconds, nanoseconds] = process.hrtime(startTime);
      const duration = seconds + nanoseconds / 1e9;
      this.metricsService.trackCommandDuration(commandName, duration);
    } catch (error) {
      this.metricsService.trackCommandError(
        commandName,
        error.name || 'UnknownError',
      );
      throw error;
    }
  }

  private async handleStatus(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const uptimeSeconds = Math.floor(
      (Date.now() - this.startTime.getTime()) / 1000,
    );
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Bot Status')
      .addFields(
        {
          name: 'Bot Uptime',
          value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
          inline: true,
        },
        {
          name: 'Memory Usage',
          value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
          inline: true,
        },
        {
          name: 'System Memory',
          value: `${Math.round(freemem() / 1024 / 1024)}MB / ${Math.round(
            totalmem() / 1024 / 1024,
          )}MB`,
          inline: true,
        },
        {
          name: 'Node.js Version',
          value: process.version,
          inline: true,
        },
        {
          name: 'Discord.js Version',
          value: discordVersion,
          inline: true,
        },
        {
          name: 'CPU',
          value: `${cpus()[0].model} (${cpus().length} cores)`,
          inline: false,
        },
        {
          name: 'System Uptime',
          value: `${Math.floor(uptime() / 3600)}h ${Math.floor(
            (uptime() % 3600) / 60,
          )}m`,
          inline: true,
        },
        {
          name: 'Ping',
          value: `${Math.round(this.client.ws.ping)}ms`,
          inline: true,
        },
      )
      .setTimestamp()
      .setFooter({ text: 'Game Update Bot' });

    await interaction.editReply({ embeds: [embed] });
  }

  private async handleHelp(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('Available Commands')
      .setDescription('Here are all the available commands:')
      .addFields(
        {
          name: '/scan-updates',
          value:
            'Scan channel for game updates in a time range\n' +
            'Options:\n' +
            '• from: Start date (YYYY-MM-DD) [Required]\n' +
            '• to: End date (YYYY-MM-DD) [Optional]\n' +
            '• channel: Channel to scan [Optional]',
        },
        {
          name: '/status',
          value: 'Show bot status and system information',
        },
        {
          name: '/ping',
          value: 'Check bot latency',
        },
        {
          name: '/help',
          value: 'Show this help message',
        },
      )
      .setTimestamp()
      .setFooter({ text: 'Game Update Bot' });

    await interaction.reply({ embeds: [embed] });
  }

  private async handlePing(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({
      content: 'Pinging...',
      fetchReply: true,
    });

    const roundtripLatency =
      sent.createdTimestamp - interaction.createdTimestamp;

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('🏓 Pong!')
      .addFields(
        {
          name: 'Bot Latency',
          value: `${roundtripLatency}ms`,
          inline: true,
        },
        {
          name: 'API Latency',
          value: `${Math.round(this.client.ws.ping)}ms`,
          inline: true,
        },
      );

    await interaction.editReply({ content: null, embeds: [embed] });
  }

  private async handleScanUpdates(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    try {
      const fromDate = new Date(interaction.options.getString('from'));
      const toDate = interaction.options.getString('to')
        ? new Date(interaction.options.getString('to'))
        : new Date();
      const channel =
        interaction.options.getChannel('channel') || interaction.channel;

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        await interaction.editReply(
          'Invalid date format. Please use YYYY-MM-DD',
        );
        return;
      }

      if (fromDate > toDate) {
        await interaction.editReply('Start date must be before end date');
        return;
      }

      const progressEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Scanning for Updates')
        .setDescription(
          `Scanning for updates from ${fromDate.toLocaleDateString()} to ${toDate.toLocaleDateString()} in ${channel.name}...`,
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [progressEmbed] });

      const messages = await this.fetchMessages(channel, fromDate, toDate);
      let updateCount = 0;
      let processedCount = 0;

      for (const message of messages) {
        try {
          await this.updateService.handleMessage(message);
          updateCount++;
        } catch (error) {
          this.logger.error(`Error processing message ${message.id}:`, error);
          this.metricsService.trackUpdateError(
            'unknown',
            error.name || 'UnknownError',
          );
        }

        processedCount++;
        if (processedCount % 100 === 0) {
          progressEmbed
            .setDescription(
              `Scanning for updates...\nProcessed ${processedCount}/${messages.length} messages\nFound ${updateCount} updates so far`,
            )
            .setTimestamp();
          await interaction.editReply({ embeds: [progressEmbed] });
        }
      }

      const resultEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Scan Complete')
        .addFields(
          {
            name: 'Channel',
            value: channel.name,
            inline: true,
          },
          {
            name: 'Time Range',
            value: `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`,
            inline: true,
          },
          {
            name: 'Messages Scanned',
            value: messages.length.toString(),
            inline: true,
          },
          {
            name: 'Updates Found',
            value: updateCount.toString(),
            inline: true,
          },
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [resultEmbed] });
    } catch (error) {
      this.logger.error('Error in scan-updates command:', error);
      this.metricsService.trackCommandError(
        'scan-updates',
        error.name || 'UnknownError',
      );
      await interaction.editReply(
        'An error occurred while scanning for updates.',
      );
    }
  }

  private async fetchMessages(channel: any, fromDate: Date, toDate: Date) {
    const messages = [];
    let lastId;

    while (true) {
      const options: any = { limit: 100 };
      if (lastId) {
        options.before = lastId;
      }

      const batch = await channel.messages.fetch(options);
      if (batch.size === 0) break;

      for (const [, message] of batch) {
        if (message.createdAt >= fromDate && message.createdAt <= toDate) {
          messages.push(message);
        } else if (message.createdAt < fromDate) {
          // We've gone too far back in time
          return messages;
        }
      }

      lastId = batch.last().id;
    }

    return messages;
  }
}
