# Infrastructure

This directory contains infrastructure configuration for local development.

## Services

- PostgreSQL (port: 5432)
- Redis (port: 6379)
- RabbitMQ (ports: 5672, 15672)
- Grafana (port: 3200)
- Loki (port: 3100)
- Promtail (internal)

## Usage

Start all services:

```bash
pnpm run infra:up
```

Stop all services and remove volumes:

```bash
pnpm run infra:down
```

## Connection Details

### PostgreSQL
- Host: localhost
- Port: 5432
- User: postgres
- Password: postgres
- Database: updateio

### Redis
- Host: localhost
- Port: 6379
- Password: redis (configurable via REDIS_PASSWORD)

### RabbitMQ
- Host: localhost
- AMQP Port: 5672
- Management UI Port: 15672
- Management UI URL: http://localhost:15672
- User: rabbit
- Password: rabbit

### MinIO
- API Endpoint: http://localhost:9000
- Console URL: http://localhost:9001
- Access Key: minioadmin
- Secret Key: minioadmin
- Console login credentials:
  - Username: minioadmin
  - Password: minioadmin

## Monitoring

Access Grafana at http://localhost:3200

### Preconfigured:
- Loki datasource for log aggregation
- Basic system logs dashboard

### Log Sources:
- System logs
- Container logs (via Promtail)

## Configuration

Copy the example environment file and modify if needed:

```bash
cp infrastructure/docker/.env.example infrastructure/docker/.env
```

Default credentials can be overridden using environment variables in the `.env` file.

