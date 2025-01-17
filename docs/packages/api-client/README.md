# API Client

## Обзор
API клиент предоставляет типизированный интерфейс для взаимодействия с API сервисом UpdateIO.

## Возможности

### REST API Клиент
- Типизированные запросы к API
- Автоматическая обработка ошибок
- Управление заголовками авторизации
- Перехват и обработка ответов

### Интеграции
- Интеграция с auth пакетом для авторизации
- Поддержка refresh токенов
- Обработка сетевых ошибок
- Retry механизмы

### Endpoints
- Управление пользователями
- Управление играми
- Управление обновлениями
- Управление подписками
- Системные операции

## Использование

```typescript
import { createApiClient } from '@updateio/api-client';

const api = createApiClient({
  baseUrl: 'http://api.updateio.local',
  credentials: 'include',
});

// Получение списка игр
const games = await api.games.getList();

// Создание обновления
const update = await api.updates.create({
  gameId: 1,
  version: '1.0.0',
  description: 'Update description',
});
```

## Конфигурация

### Базовая настройка
```typescript
interface ApiClientConfig {
  baseUrl: string;
  credentials?: RequestCredentials;
  headers?: Record<string, string>;
  timeout?: number;
}
```

### Настройка перехватчиков
```typescript
api.interceptors.request.use((config) => {
  // Модификация запроса
  return config;
});

api.interceptors.response.use((response) => {
  // Обработка ответа
  return response;
});
```

## Обработка Ошибок

### Типы ошибок
- `ApiError` - Базовый класс ошибок
- `NetworkError` - Ошибки сети
- `AuthError` - Ошибки авторизации
- `ValidationError` - Ошибки валидации
- `NotFoundError` - Ресурс не найден

### Пример обработки
```typescript
try {
  await api.games.getById(1);
} catch (error) {
  if (error instanceof AuthError) {
    // Обработка ошибки авторизации
  } else if (error instanceof ValidationError) {
    // Обработка ошибки валидации
  }
}
```

## Типизация

### Модели данных
```typescript
interface Game {
  id: number;
  name: string;
  provider: GameProvider;
  currentVersion: string;
}

interface Update {
  id: number;
  gameId: number;
  version: string;
  description: string;
  status: UpdateStatus;
}
```

### Параметры запросов
```typescript
interface GetGamesParams {
  page?: number;
  limit?: number;
  search?: string;
  provider?: GameProvider;
}
``` 