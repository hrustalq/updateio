# UpdateIO Telegram Бот

Telegram бот для доставки уведомлений об обновлениях игр пользователям и управления их подписками.

## Возможности

- 🔔 Уведомления об обновлениях игр в реальном времени
- 📝 Управление подписками пользователей
- 🎮 Настройка предпочтений для конкретных игр
- 📊 Отслеживание статуса доставки уведомлений
- 🔐 Аутентификация и авторизация пользователей
- 🔄 Интеграция с UpdateIO API

## Требования

- Node.js 18+
- pnpm 8+
- Redis 7+
- Telegram Bot Token (получить у [@BotFather](https://t.me/BotFather))

## Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```bash
# APP
NODE_ENV=development
HOST=localhost
PORT=3003

# REDIS
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_TTL=4h
REDIS_PASSWORD=redis

# AUTH
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

## Установка

1. Установите зависимости:
```bash
pnpm install
```

2. Настройте переменные окружения:
```bash
cp .env.example .env
# Отредактируйте .env файл
```

3. Соберите проект:
```bash
pnpm build
```

4. Запустите бота:
```bash
pnpm start
```

Для разработки:
```bash
pnpm dev
```

## Архитектура

Бот построен с использованием:
- [Telegraf](https://github.com/telegraf/telegraf) - Современный фреймворк для Telegram ботов
- TypeScript - Для типизации и улучшения разработки
- Zod - Для валидации типов во время выполнения
- Redis - Для кэширования и управления сессиями

## Команды

- `/start` - Инициализация бота и регистрация пользователя
- `/subscribe <игра>` - Подписаться на обновления игры
- `/unsubscribe <игра>` - Отписаться от обновлений игры
- `/list` - Список активных подписок
- `/settings` - Управление настройками уведомлений
- `/help` - Показать доступные команды

## Разработка

### Структура проекта

```
src/
├── commands/        # Реализация команд бота
├── handlers/        # Обработчики сообщений и событий
├── services/        # Бизнес-логика и внешние сервисы
├── types/          # TypeScript типы и интерфейсы
├── utils/          # Вспомогательные функции
└── config/         # Управление конфигурацией
```

### Добавление новых команд

1. Создайте файл команды в `src/commands/`
2. Зарегистрируйте команду при инициализации бота
3. Добавьте документацию к команде
4. Протестируйте реализацию

## Тестирование

```bash
# Запуск тестов
pnpm test

# Запуск тестов в режиме наблюдения
pnpm test:watch
```

## Участие в разработке

1. Создайте ветку для новой функциональности
2. Внесите изменения
3. Добавьте тесты
4. Создайте Pull Request

## Лицензия

MIT
