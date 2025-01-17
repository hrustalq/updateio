# Credentials

## Обзор
Пакет credentials предоставляет безопасное управление учетными данными и секретами для всех приложений системы UpdateIO.

## Возможности

### Управление Секретами
- Безопасное хранение ключей API
- Шифрование чувствительных данных
- Ротация ключей
- Управление доступом

### Интеграции
- Discord API ключи
- Telegram Bot токены
- База данных
- Внешние сервисы

### Безопасность
- Шифрование в покое
- Безопасная передача
- Аудит доступа
- Валидация данных

## Использование

### Базовое Использование
```typescript
import { createCredentialsManager } from '@updateio/credentials';

const credentials = createCredentialsManager({
  encryptionKey: process.env.ENCRYPTION_KEY,
  storage: 'secure-store',
});

// Сохранение секрета
await credentials.set('discord.bot.token', 'your-token-here');

// Получение секрета
const token = await credentials.get('discord.bot.token');
```

### Работа с API Ключами
```typescript
// Управление ключами API
const apiKeys = credentials.scope('api-keys');

// Создание нового ключа
const key = await apiKeys.create({
  name: 'Production API Key',
  permissions: ['read', 'write'],
});

// Ротация ключа
await apiKeys.rotate('key-id');
```

### Интеграция с Сервисами
```typescript
// Discord интеграция
const discordCreds = credentials.scope('discord');
await discordCreds.configure({
  clientId: 'client-id',
  clientSecret: 'client-secret',
  botToken: 'bot-token',
});

// Telegram интеграция
const telegramCreds = credentials.scope('telegram');
await telegramCreds.configure({
  botToken: 'bot-token',
  webhookSecret: 'webhook-secret',
});
```

## Конфигурация

### Основные Настройки
```typescript
interface CredentialsConfig {
  encryptionKey: string;
  storage: 'secure-store' | 'env' | 'vault';
  namespace?: string;
  ttl?: number;
}
```

### Настройки Шифрования
```typescript
interface EncryptionConfig {
  algorithm: string;
  keySize: number;
  ivSize: number;
}
```

## Безопасность

### Шифрование
- AES-256-GCM шифрование
- Безопасная генерация ключей
- Защита от атак повторного воспроизведения
- Проверка целостности данных

### Хранение
- Безопасное хранилище
- Изоляция данных
- Контроль доступа
- Аудит изменений

## Типизация

### Модели
```typescript
interface Secret {
  id: string;
  name: string;
  value: string;
  createdAt: Date;
  expiresAt?: Date;
}

interface ApiKey {
  id: string;
  key: string;
  name: string;
  permissions: string[];
  lastUsed?: Date;
}
```

### Конфигурации Сервисов
```typescript
interface DiscordConfig {
  clientId: string;
  clientSecret: string;
  botToken: string;
  webhookSecret?: string;
}

interface TelegramConfig {
  botToken: string;
  webhookSecret: string;
  paymentToken?: string;
}
``` 