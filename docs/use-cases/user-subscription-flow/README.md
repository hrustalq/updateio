# Процесс Управления Подписками

## Обзор
Описание процесса управления подписками на обновления игр через Telegram бота и REST API, включая как пользовательские, так и административные функции.

## Участники
- Пользователь
- Администратор
- Telegram бот
- API сервис
- База данных

## Способы Подписки

### 1. Через Личные Сообщения Бота
1. Пользователь начинает диалог с ботом
2. Отправляет команду /subscribe
3. Бот предлагает список доступных игр
4. Пользователь выбирает игры для подписки
5. Система создает подписки и отправляет подтверждение

### 2. Через Групповой Чат
1. Администратор группы добавляет бота в чат
2. Бот отправляет приветственное сообщение с инструкциями
3. Пользователи могут использовать команду /subscribe
4. Бот создает подписки для группы
5. Уведомления об обновлениях будут приходить в общий чат

## API Endpoints

### Пользовательские Endpoints

```typescript
// Получение своих подписок
GET /api/v1/subscriptions
Authorization: Bearer <user_token>

// Создание подписки
POST /api/v1/subscriptions
Authorization: Bearer <user_token>
{
  gameIds: string[];
}

// Обновление своей подписки
PATCH /api/v1/subscriptions/:subscriptionId
Authorization: Bearer <user_token>
{
  gameIds?: string[];
  notificationsEnabled?: boolean;
}

// Удаление подписки
DELETE /api/v1/subscriptions/:subscriptionId
Authorization: Bearer <user_token>
```

### Административные Endpoints

```typescript
// Получение всех подписок
GET /api/v1/admin/subscriptions
Authorization: Bearer <admin_token>

// Получение подписок пользователя
GET /api/v1/admin/users/:userId/subscriptions
Authorization: Bearer <admin_token>

// Создание подписки для пользователя
POST /api/v1/admin/users/:userId/subscriptions
Authorization: Bearer <admin_token>
{
  gameIds: string[];
  notificationsEnabled?: boolean;
}

// Обновление подписки пользователя
PATCH /api/v1/admin/subscriptions/:subscriptionId
Authorization: Bearer <admin_token>
{
  gameIds?: string[];
  notificationsEnabled?: boolean;
}

// Удаление подписки пользователя
DELETE /api/v1/admin/subscriptions/:subscriptionId
Authorization: Bearer <admin_token>
```

### Групповые Подписки

```typescript
// Получение подписок группы
GET /api/v1/groups/:groupId/subscriptions
Authorization: Bearer <user_token>

// Создание подписки для группы
POST /api/v1/groups/:groupId/subscriptions
Authorization: Bearer <user_token>
{
  gameIds: string[];
}

// Обновление групповой подписки
PATCH /api/v1/groups/:groupId/subscriptions/:subscriptionId
Authorization: Bearer <user_token>
{
  gameIds?: string[];
}

// Удаление групповой подписки
DELETE /api/v1/groups/:groupId/subscriptions/:subscriptionId
Authorization: Bearer <user_token>
```

## Процесс Уведомлений

### Личные Уведомления
1. Система обнаруживает обновление игры
2. Находит всех пользователей с активной подпиской
3. Отправляет персональное уведомление каждому пользователю
4. Сохраняет статус отправки

### Групповые Уведомления
1. Система обнаруживает обновление игры
2. Находит все группы с активной подпиской
3. Отправляет одно уведомление в каждую группу
4. Сохраняет статус отправки

## Ограничения и Квоты

### Пользовательские Ограничения
- Максимум 10 игр на одного пользователя
- Ограничение частоты запросов к API
- Только владелец может управлять своими подписками

### Групповые Ограничения
- Максимум 5 игр на группу
- Только администраторы группы могут управлять подписками
- Ограничение на количество групп для одного пользователя

## Обработка Ошибок

### API Ошибки
```typescript
{
  status: number;
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

### Типовые Ошибки
- 400: Неверный формат запроса
- 401: Не авторизован
- 403: Нет прав доступа
- 404: Ресурс не найден
- 429: Превышен лимит запросов

## Метрики и Мониторинг

### Бизнес-метрики
- Количество активных подписок
- Количество подписок по играм
- Активность пользователей
- Конверсия подписок

### Технические метрики
- Время ответа API
- Количество ошибок
- Нагрузка на систему
- Статистика уведомлений 