# UpdateIO

Система для автоматизации обновлений игр, включающая мониторинг Discord каналов, уведомления пользователей через Telegram и автоматическое обновление клиентских приложений.

## Возможности

- 🎮 Мониторинг обновлений игр через Discord
- 📱 Уведомления пользователей через Telegram
- 🔄 Автоматическое обновление игр
- 💳 Система подписок
- 👥 Управление пользователями
- 📊 Мониторинг и аналитика

## Быстрый Старт

### Требования

- Node.js 18+
- pnpm 8+
- Docker и Docker Compose
- PostgreSQL 15+
- Redis 7+
- Kafka 3+

### Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/updateio.git
cd updateio
```

2. Установите зависимости:
```bash
pnpm install
```

3. Настройте переменные окружения:
```bash
cp .env.example .env
# Отредактируйте .env файл, добавив необходимые ключи API и настройки
```

4. Запустите инфраструктуру:
```bash
cd infrastructure/docker
docker-compose up -d
```

5. Запустите приложения:
```bash
pnpm dev
```

## Структура Проекта

```
updateio/
├── apps/                      # Приложения
│   ├── api/                   # API сервис (NestJS)
│   ├── discord-bot/           # Discord бот
│   ├── tg-bot/               # Telegram бот
│   ├── adminka/              # Админ панель
│   └── tg-miniapp/           # Telegram мини-приложение
├── packages/                  # Общие пакеты
│   ├── api-client/           # Типизированный API клиент
│   ├── auth/                 # Аутентификация и авторизация
│   ├── auth-store/           # Хранилище состояния auth
│   ├── credentials/          # Управление учетными данными
│   ├── database/             # Общие компоненты БД
│   ├── shared/               # Общие утилиты
│   ├── types/                # Общие типы
│   ├── ui/                   # UI компоненты
│   └── config/               # Конфигурации (ESLint, TypeScript)
├── infrastructure/           # Docker конфигурации
└── docs/                     # Документация
```

## Документация

### Приложения
- [API Сервис](docs/apps/api/README.md)
- [Discord Бот](docs/apps/discord-bot/README.md)
- [Telegram Бот](docs/apps/tg-bot/README.md)
- [Админ Панель](docs/apps/adminka/README.md)
- [Telegram Мини-Приложение](docs/apps/tg-miniapp/README.md)

### Пакеты
- [API Client](docs/packages/api-client/README.md)
- [Auth](docs/packages/auth/README.md)
- [Auth Store](docs/packages/auth-store/README.md)
- [Credentials](docs/packages/credentials/README.md)
- [Database](docs/packages/database/README.md)
- [Shared](docs/packages/shared/README.md)
- [Types](docs/packages/types/README.md)
- [UI](docs/packages/ui/README.md)

### Сценарии Использования
- [Процесс Обновления Игры](docs/use-cases/game-update-flow/README.md)

### Инфраструктура
- [Развертывание и Конфигурация](docs/infrastructure/README.md)

## Разработка

### Команды

- `pnpm dev` - Запуск всех приложений в режиме разработки
- `pnpm build` - Сборка всех приложений
- `pnpm test` - Запуск тестов
- `pnpm lint` - Проверка кода
- `pnpm format` - Форматирование кода

### Рабочий Процесс

1. Создайте ветку для новой функциональности
2. Внесите изменения
3. Убедитесь, что все тесты проходят
4. Создайте Pull Request

## Лицензия

MIT
