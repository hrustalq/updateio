# Update.io

Update.io is a platform that allows you to update your games in a simple way automatically.

## Table of contents

- [Backend](#backend)
  - [API](#api)
  - [Telegram Bot](#telegram-bot)
  - [Discord Bot](#discord-bot)
- [Frontend](#frontend)
  - [Web Version](#web-version)
  - [Telegram Version](#telegram-version)
- [Desktop](#desktop)
  - [Desktop App](#desktop-app)
- [Infra](#infra)
  - [Redis](#redis)
  - [Postgres](#postgres)
  - [RabbitMQ](#rabbitmq)
  - [MinIO](#minio)

## Backend

The backend is responsible for handling all the business logic of the platform, including:

- Authentication and authorization
- User management
- Game management
- Update management
- Notification management
- etc.

### API

#### Tech Stack

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [Prisma](https://www.prisma.io/)

### Telegram Bot

#### Tech Stack

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

### Discord Bot

#### Tech stack

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Frontend

### Web Version

### Telegram Version

## Desktop

### Desktop App

## Infra

### Redis

Redis is responsible for storing cached data and other temporary data.

### Postgres

Postgres is responsible for storing all the data of the platform.

### RabbitMQ

RabbitMQ is responsible for handling all the background jobs of the platform, including notifications, updates, etc.
