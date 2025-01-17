# Database

## Обзор
Пакет database предоставляет общие компоненты для работы с базой данных через Prisma ORM, включая схемы, миграции и утилиты.

## Возможности

### Prisma Интеграция
- Общая схема данных
- Управление миграциями
- Типизированные модели
- Сидеры данных

### Утилиты
- Построители запросов
- Пагинация
- Сортировка
- Фильтрация

### Расширения
- Мягкое удаление
- Аудит изменений
- Кэширование
- Валидация

## Использование

### Базовое Использование
```typescript
import { PrismaClient } from '@updateio/database';

const prisma = new PrismaClient();

// Получение пользователей
const users = await prisma.user.findMany({
  include: {
    subscriptions: true,
  },
});

// Создание игры
const game = await prisma.game.create({
  data: {
    name: 'Counter-Strike 2',
    provider: 'STEAM',
    currentVersion: '1.0.0',
  },
});
```

### Построители Запросов
```typescript
import { createQueryBuilder } from '@updateio/database';

const query = createQueryBuilder('game')
  .where('provider', 'STEAM')
  .orderBy('name', 'asc')
  .paginate(1, 10);

const games = await query.execute();
```

### Расширенные Операции
```typescript
// Мягкое удаление
await prisma.user.softDelete({
  where: { id: 1 },
});

// Аудит изменений
const changes = await prisma.game.getAuditLog({
  where: { id: 1 },
});

// Кэширование
const cachedGames = await prisma.game.findManyCached({
  where: { provider: 'STEAM' },
  ttl: 3600,
});
```

## Схема Данных

### Основные Модели
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  subscriptions Subscription[]
}

model Game {
  id             Int      @id @default(autoincrement())
  name           String
  provider       Provider
  currentVersion String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  updates Update[]
}

model Update {
  id          Int      @id @default(autoincrement())
  gameId      Int
  version     String
  description String
  status      Status   @default(PENDING)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  game Game @relation(fields: [gameId], references: [id])
}
```

### Перечисления
```prisma
enum Role {
  USER
  ADMIN
  MODERATOR
}

enum Provider {
  STEAM
  EPIC
  BATTLENET
}

enum Status {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

## Миграции

### Команды
```bash
# Создание миграции
pnpm prisma migrate dev --name add_user_role

# Применение миграций
pnpm prisma migrate deploy

# Сброс базы данных
pnpm prisma migrate reset
```

## Сиды

### Базовые Данные
```typescript
import { PrismaClient } from '@updateio/database';
import { seedUsers, seedGames } from './seeds';

async function seed() {
  const prisma = new PrismaClient();

  // Сидинг пользователей
  await seedUsers(prisma);

  // Сидинг игр
  await seedGames(prisma);
}
```

## Типизация

### Утилиты
```typescript
import { Prisma } from '@updateio/database';

type GameWithUpdates = Prisma.GameGetPayload<{
  include: {
    updates: true;
  };
}>;

type UserWithSubscriptions = Prisma.UserGetPayload<{
  include: {
    subscriptions: true;
  };
}>;
``` 