# Процесс Обновления Клиентов

## Обзор
Описание процесса автоматического обновления игр для клиентов UpdateIO, включая обнаружение, загрузку, установку и верификацию обновлений.

## Участники
- Клиентское приложение
- API сервис
- Система уведомлений
- Игровые провайдеры
- База данных

## Технические Компоненты

### Модели Данных
```prisma
model GameUpdate {
  id          String   @id @default(cuid())
  gameId      String
  version     String
  content     String
  status      UpdateStatus @default(PENDING)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  game        Game     @relation(fields: [gameId], references: [id])
  commands    UpdateCommand[]
  notifications Notification[]

  @@index([gameId])
}

model UpdateCommand {
  id          String   @id @default(cuid())
  gameId      String   @unique
  command     String
  args        String[]
  timeout     Int      @default(3600) // seconds
  retries     Int      @default(3)
  
  game        Game     @relation(fields: [gameId], references: [id])
  updates     GameUpdate[]
}

enum UpdateStatus {
  PENDING
  DOWNLOADING
  INSTALLING
  COMPLETED
  FAILED
}
```

### API Endpoints
```typescript
// Проверка обновлений
GET /api/v1/games/:gameId/updates
{
  currentVersion: string;
}

// Получение команды обновления
GET /api/v1/games/:gameId/update-command
{
  updateId: string;
}

// Обновление статуса
PATCH /api/v1/updates/:updateId/status
{
  status: UpdateStatus;
  error?: string;
}
```

### События Kafka
```typescript
// Запуск обновления
interface UpdateStartedEvent {
  type: 'update.started';
  payload: {
    updateId: string;
    gameId: string;
    version: string;
  };
}

// Завершение обновления
interface UpdateCompletedEvent {
  type: 'update.completed';
  payload: {
    updateId: string;
    gameId: string;
    success: boolean;
    error?: string;
  };
}
```

## Процессы

### Обнаружение Обновлений
1. Клиент периодически проверяет наличие обновлений
2. Сравнение версий с текущей установленной
3. Получение метаданных обновления
4. Проверка совместимости
5. Подготовка к загрузке

### Загрузка и Установка
1. Получение команды обновления
2. Проверка зависимостей
3. Загрузка файлов обновления
4. Верификация загруженных данных
5. Выполнение команды обновления
6. Проверка результата установки

### Верификация
1. Проверка целостности файлов
2. Валидация версии после установки
3. Тестирование базовой функциональности
4. Создание отчета об обновлении
5. Отправка статуса в API

## Команды Обновления

### Структура Команды
```typescript
interface UpdateCommandConfig {
  command: string;      // Основная команда
  args: string[];      // Аргументы
  workingDir?: string; // Рабочая директория
  timeout: number;     // Таймаут в секундах
  retries: number;     // Количество попыток
  validation: {        // Правила валидации
    checksum?: string;
    version?: string;
    tests?: string[];
  };
}
```

### Примеры Команд
```bash
# Steam
steam cmd +app_update {gameId} validate

# Epic Games
epicgames-launcher.exe -command=update -app={gameId} -version={version}

# Custom
update-client.exe --game={gameId} --version={version} --path={path}
```

## Обработка Ошибок

### Ошибки Загрузки
- Недостаточно места
- Сетевые проблемы
- Поврежденные файлы
- Таймауты загрузки

### Ошибки Установки
- Конфликты версий
- Проблемы совместимости
- Сбои команд
- Ошибки валидации

### Восстановление
1. Откат к предыдущей версии
2. Очистка временных файлов
3. Перезапуск процесса
4. Уведомление пользователя

## Метрики

### Статистика Обновлений
- Время загрузки
- Время установки
- Успешность обновлений
- Частота ошибок

### Мониторинг Клиентов
- Версии клиентов
- Статусы обновлений
- Использование ресурсов
- Проблемные обновления 