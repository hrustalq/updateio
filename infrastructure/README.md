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

### RabbitMQ
- Host: localhost
- AMQP Port: 5672
- Management UI Port: 15672
- Management UI URL: http://localhost:15672
- User: rabbit
- Password: rabbit

## Monitoring

Access Grafana at http://localhost:3200

### Preconfigured:
- Loki datasource for log aggregation
- Basic system logs dashboard

### Log Sources:
- System logs
- Container logs (via Promtail)

