import type { components } from '@repo/api-client'

// Re-export common types from API schema
export type Game = components['schemas']['GameDto']
export type GameProvider = components['schemas']['GameProviderDto']
export type User = components['schemas']['UserDto']
export type Subscription = components['schemas']['SubscriptionDto']
export type Notification = components['schemas']['NotificationDto']
export type Report = components['schemas']['ReportDto']
export type UpdateCommand = components['schemas']['UpdateCommandDto']
export type GameUpdate = components['schemas']['UpdateDto']

// Re-export create/update DTOs
export type CreateGame = components['schemas']['CreateGameDto']
export type UpdateGame = components['schemas']['UpdateGameDto']
export type CreateGameProvider = components['schemas']['CreateGameProviderDto']
export type UpdateGameProvider = components['schemas']['UpdateGameProviderDto']
export type CreateUser = components['schemas']['CreateUserDto']
export type UpdateUser = components['schemas']['UpdateUserDto']
export type CreateSubscription = components['schemas']['CreateSubscriptionDto']
export type UpdateSubscription = components['schemas']['UpdateSubscriptionDto']
export type CreateNotification = components['schemas']['CreateNotificationDto']
export type UpdateNotification = components['schemas']['UpdateNotificationDto']
export type CreateReport = components['schemas']['CreateReportDto']
export type UpdateReport = components['schemas']['UpdateReportDto']
export type CreateUpdateCommand = components['schemas']['CreateUpdateCommandDto']
export type UpdateUpdateCommand = components['schemas']['UpdateUpdateCommandDto']
export type CreateGameUpdate = components['schemas']['CreateUpdateDto']
export type UpdateGameUpdate = components['schemas']['UpdateUpdateDto']

// Re-export response types
export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    timestamp: string
    path: string
    version: string
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}

export interface Response<T> {
  data: T
  meta: {
    timestamp: string
    path: string
    version: string
  }
}

// Re-export enums
export type UserRole = components['schemas']['UserDto']['role']
export type NotificationType = components['schemas']['NotificationDto']['type']
