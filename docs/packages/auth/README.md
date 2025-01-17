# Auth

## Обзор
Пакет auth предоставляет общую логику аутентификации и авторизации для всех приложений системы UpdateIO.

## Возможности

### Аутентификация
- JWT токены (access и refresh)
- OAuth2 интеграции (Discord, Telegram)
- Сессионное управление
- Безопасное хранение токенов

### Авторизация
- Ролевой доступ (RBAC)
- Проверка разрешений
- Политики доступа
- Контекст безопасности

### Интеграции
- Интеграция с API клиентом
- Поддержка различных хранилищ
- События аутентификации
- Middleware для NestJS

## Использование

### Базовая аутентификация
```typescript
import { createAuth } from '@updateio/auth';

const auth = createAuth({
  storage: 'localStorage',
  tokenPrefix: 'updateio',
});

// Аутентификация
await auth.login({
  username: 'user@example.com',
  password: 'password',
});

// Проверка статуса
const isAuthenticated = auth.isAuthenticated();

// Выход
await auth.logout();
```

### OAuth Аутентификация
```typescript
// Discord OAuth
await auth.loginWithDiscord();

// Telegram OAuth
await auth.loginWithTelegram();
```

### Проверка Разрешений
```typescript
// Проверка роли
if (auth.hasRole('admin')) {
  // Административные действия
}

// Проверка разрешения
if (auth.can('update:create')) {
  // Создание обновления
}
```

## Конфигурация

### Основные настройки
```typescript
interface AuthConfig {
  storage: 'localStorage' | 'sessionStorage' | 'memory';
  tokenPrefix?: string;
  refreshInterval?: number;
  oauth?: OAuthConfig;
}

interface OAuthConfig {
  discord?: {
    clientId: string;
    redirectUri: string;
  };
  telegram?: {
    botName: string;
  };
}
```

### События
```typescript
auth.on('login', (user) => {
  console.log('Пользователь вошел:', user);
});

auth.on('logout', () => {
  console.log('Пользователь вышел');
});

auth.on('tokenRefresh', (tokens) => {
  console.log('Токены обновлены');
});
```

## Безопасность

### Хранение Токенов
- Безопасное хранение в localStorage/sessionStorage
- Шифрование чувствительных данных
- Автоматическое обновление токенов
- Защита от XSS

### Защита Запросов
- CSRF токены
- Проверка origin
- Rate limiting
- Защита от брутфорса

## Типизация

### Модели
```typescript
interface User {
  id: number;
  email: string;
  roles: Role[];
  permissions: Permission[];
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

### Роли и Разрешения
```typescript
type Role = 'admin' | 'user' | 'moderator';

interface Permission {
  action: string;
  subject: string;
  conditions?: Record<string, any>;
}
``` 