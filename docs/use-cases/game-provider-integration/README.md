# Интеграция Игровых Провайдеров

## Обзор
Описание процесса интеграции новых игровых провайдеров в систему UpdateIO, включая регистрацию провайдера, управление играми и обработку обновлений.

## Участники
- Администратор системы
- API сервис
- Discord бот
- База данных
- Внешние API провайдеров

## Поток Событий

### 1. Регистрация Провайдера
- Администратор создает нового провайдера через админ-панель
- Система сохраняет базовую информацию о провайдере:
  - Название
  - Описание
  - URL изображения
- Настройка специфичных параметров провайдера

### 2. Добавление Игр
- Система получает список игр от провайдера
- Создание записей в базе данных:
  - Основная информация об игре
  - Привязка к провайдеру
  - Сохранение внешнего ID
- Настройка мониторинга обновлений

### 3. Настройка Мониторинга
- Конфигурация Discord каналов для провайдера
- Настройка паттернов распознавания обновлений
- Определение команд обновления
- Установка правил валидации

### 4. Обработка Обновлений
- Получение информации об обновлении
- Сопоставление с играми провайдера
- Создание записи об обновлении
- Рассылка уведомлений

## Технические Компоненты

### Модели Данных
```prisma
// Из schema.prisma
model GameProvider {
  id          String   @id @default(cuid())
  name        String
  description String?
  imageUrl    String?
  games       Game[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Game {
  id          String   @id @default(cuid())
  name        String
  description String?
  imageUrl    String?
  externalId  String?
  providerId  String
  provider    GameProvider @relation(fields: [providerId], references: [id])
  updates     GameUpdate[]
  updateCommand UpdateCommand?
}
```

### API Endpoints
```typescript
// Управление провайдерами
POST /api/v1/providers
{
  name: string;
  description?: string;
  imageUrl?: string;
}

// Добавление игр
POST /api/v1/providers/:providerId/games
{
  name: string;
  description?: string;
  imageUrl?: string;
  externalId: string;
}

// Настройка мониторинга
POST /api/v1/providers/:providerId/monitoring
{
  discordChannels: string[];
  updatePatterns: UpdatePattern[];
  commandTemplate: string;
}
```

### События Kafka
```typescript
// Новый провайдер
interface ProviderCreatedEvent {
  type: 'provider.created';
  payload: {
    providerId: string;
    name: string;
  };
}

// Новая игра
interface GameAddedEvent {
  type: 'game.added';
  payload: {
    gameId: string;
    providerId: string;
    externalId: string;
  };
}
```

## Интеграционные Паттерны

### Discord Мониторинг
```typescript
interface UpdatePattern {
  provider: string;
  channelPattern: string;
  messagePattern: string;
  extractors: {
    version?: RegExp;
    content?: RegExp;
  };
}
```

### Команды Обновления
```typescript
interface UpdateCommand {
  gameId: string;
  command: string;
}
```

## Обработка Ошибок

### Ошибки Интеграции
- Недоступность API провайдера
- Ошибки аутентификации
- Несоответствие форматов данных
- Проблемы синхронизации

### Ошибки Мониторинга
- Недоступность Discord каналов
- Ошибки распознавания обновлений
- Проблемы с командами обновления
- Конфликты версий

## Метрики

### Мониторинг Провайдеров
- Количество игр по провайдерам
- Частота обновлений
- Успешность обработки
- Время отклика API

### Качество Интеграции
- Точность распознавания обновлений
- Процент ошибок
- Задержки обработки
- Полнота данных 