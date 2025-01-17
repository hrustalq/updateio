import { Context } from 'telegraf';
import { Message, Update } from 'telegraf/types';
import {
  Game,
  GameUpdate as PrismaGameUpdate,
  NotificationType,
  User,
  UserSubscription,
} from '@repo/database';

// Custom context type for text messages
export interface TextMessageContext extends Context {
  message: Update.New & Update.NonChannel & Message.TextMessage;
}

// Extend the context with our custom session data
export interface BotSession {
  gameSubscriptions: string[];
  notificationSettings: {
    frequency: 'instant' | 'daily' | 'weekly';
    messageFormat: 'short' | 'detailed';
  };
}

export interface BotContext extends Context {
  session: BotSession;
}

// Re-export types from database
export type { Game, User, UserSubscription };

// Extend PrismaGameUpdate for our needs
export interface GameUpdate
  extends Omit<PrismaGameUpdate, 'id' | 'createdAt' | 'updatedAt'> {}

// Notification settings
export interface NotificationSettings {
  userId: string;
  frequency: 'instant' | 'daily' | 'weekly';
  messageFormat: 'short' | 'detailed';
  type: NotificationType;
}

// Subscription type combining Prisma type with notification settings
export interface Subscription
  extends Omit<UserSubscription, 'id' | 'createdAt' | 'updatedAt'> {
  notificationSettings: NotificationSettings;
}
