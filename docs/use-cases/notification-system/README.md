# Система Уведомлений

## Обзор
Описание системы уведомлений UpdateIO, обеспечивающей информирование пользователей о различных событиях: обновлениях игр, отчетах, предупреждениях и ошибках.

## Участники
- Пользователи
- Telegram бот
- API сервис
- Система обновлений
- База данных

## Типы Уведомлений

### Обновления (UPDATE)
- Новые версии игр
- Изменения в играх
- Статус обновлений
- Результаты установки

### Отчеты (REPORT)
- Статистика использования
- Сводки обновлений
- Периодические отчеты
- Аналитика

### Предупреждения (WARNING)
- Приближающиеся события
- Потенциальные проблемы
- Системные предупреждения
- Рекомендации

### Ошибки (ERROR)
- Сбои обновлений
- Системные ошибки
- Проблемы интеграции
- Критические уведомления

## Технические Компоненты

### Модели Данных
```prisma
// Из schema.prisma
enum NotificationType {
  UPDATE
  REPORT
  WARNING
  ERROR
}

model Notification {
  id          String   @id @default(cuid())
  userId      String
  gameUpdateId String
  type        NotificationType @default(UPDATE)
  content     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User @relation(fields: [userId], references: [id])
  gameUpdate  GameUpdate @relation(fields: [gameUpdateId], references: [id])

  @@index([userId])
  @@index([gameUpdateId])
}
```

### API Endpoints
```typescript
// Создание уведомления
POST /api/v1/notifications
{
  userId: string;
  gameUpdateId: string;
  type: NotificationType;
  content?: string;
}

// Получение уведомлений пользователя
GET /api/v1/users/:userId/notifications
{
  type?: NotificationType;
  from?: Date;
  to?: Date;
  limit?: number;
  offset?: number;
}

// Отметка уведомлений как прочитанных
PATCH /api/v1/notifications/mark-read
{
  notificationIds: string[];
}
```

### События Kafka
```typescript
// Создание уведомления
interface NotificationCreatedEvent {
  type: 'notification.created';
  payload: {
    notificationId: string;
    userId: string;
    notificationType: NotificationType;
    gameUpdateId?: string;
  };
}

// Групповая рассылка
interface BulkNotificationEvent {
  type: 'notification.bulk';
  payload: {
    userIds: string[];
    notificationType: NotificationType;
    content: string;
    gameUpdateId?: string;
  };
}
```

## Процессы

### Создание Уведомлений
1. Событие триггерит создание уведомления
2. Система определяет тип уведомления
3. Формируется контент уведомления
4. Определяются получатели
5. Создаются записи в БД
6. Запускается процесс доставки

### Доставка Уведомлений
1. Получение списка активных уведомлений
2. Определение каналов доставки
3. Форматирование сообщений
4. Отправка через Telegram бот
5. Обработка статуса доставки
6. Обновление статуса в БД

### Управление Уведомлениями
1. Пользователь получает уведомление
2. Возможность отметить как прочитанное
3. Архивация старых уведомлений
4. Настройка предпочтений получения

## Настройки Пользователя

### Параметры Уведомлений
```typescript
interface NotificationSettings {
  enabled: boolean;
  types: NotificationType[];
  telegramEnabled: boolean;
  emailEnabled?: boolean;
  quiet: {
    from: string; // время
    to: string;   // время
    timezone: string;
  };
}
```

## Обработка Ошибок

### Ошибки Доставки
- Недоступность Telegram
- Блокировка бота пользователем
- Сетевые проблемы
- Таймауты

### Системные Ошибки
- Ошибки создания уведомлений
- Проблемы с БД
- Конфликты данных
- Ошибки форматирования

## Метрики

### Статистика Уведомлений
- Количество по типам
- Скорость доставки
- Процент прочтения
- Эффективность каналов

### Мониторинг Системы
- Нагрузка на систему
- Очереди уведомлений
- Ошибки доставки
- Время обработки 