import { z } from 'zod';

export const groupSettingsSchema = z.object({
  maxSubscriptions: z.number().min(1).max(20),
  notificationsEnabled: z.boolean(),
  allowMemberSubscribe: z.boolean(),
  allowMemberUnsubscribe: z.boolean(),
  quietHoursStart: z.string().optional(),
  quietHoursEnd: z.string().optional(),
  timezone: z.string().default('UTC'),
});

export const groupMemberSchema = z.object({
  userId: z.string(),
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER']),
  canManageSubscriptions: z.boolean(),
  canManageMembers: z.boolean(),
  canManageSettings: z.boolean(),
});

export const groupInfoSchema = z.object({
  id: z.string(),
  telegramId: z.string(),
  title: z.string(),
  type: z.string(),
  isActive: z.boolean(),
  settings: groupSettingsSchema,
  members: z.array(groupMemberSchema),
  subscriptionCount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type GroupSettings = z.infer<typeof groupSettingsSchema>;
export type GroupMember = z.infer<typeof groupMemberSchema>;
export type GroupInfo = z.infer<typeof groupInfoSchema>;
