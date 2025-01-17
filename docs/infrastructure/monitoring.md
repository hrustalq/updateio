# Monitoring Setup

This document describes the monitoring setup for UpdateIO applications using Prometheus and Grafana.

## Overview

We use the following stack for monitoring:
- Prometheus - metrics collection and storage
- Grafana - metrics visualization
- Node Exporter - system metrics (CPU, memory, etc.)

## Configuration

The monitoring configuration files are located in the following directories:
- Prometheus: `infrastructure/docker/config/prometheus/prometheus.yml`
- Docker Compose: `infrastructure/docker/docker-compose.yml`

## Applications Monitored

### API (@api)
- HTTP request metrics (count, duration, status codes)
- Application metrics (memory usage, event loop lag)
- Custom business metrics (updates processed, notifications sent)

### Admin Panel (@adminka)
- Frontend performance metrics
- User interaction metrics
- API request metrics

## Metrics

### API Metrics
- `http_request_duration_seconds` - HTTP request duration
- `http_requests_total` - Total HTTP requests count
- `game_updates_processed_total` - Total game updates processed
- `notifications_sent_total` - Total notifications sent
- `active_users_gauge` - Current number of active users
- `event_loop_lag_seconds` - Event loop lag
- `memory_usage_bytes` - Memory usage

### Admin Panel Metrics
- `frontend_page_load_time_seconds` - Page load time
- `frontend_api_request_duration_seconds` - API request duration
- `frontend_error_count_total` - Frontend error count
- `user_interaction_count_total` - User interaction count

## Setup Instructions

### API Setup
1. Install dependencies:
```bash
pnpm add @nestjs/terminus @willsoto/nestjs-prometheus prom-client
```

2. Configure Prometheus endpoint at `/metrics`
3. Configure custom metrics collectors

### Admin Panel Setup
1. Install dependencies:
```bash
pnpm add prometheus-client-js
```

2. Configure client-side metrics collection
3. Set up metrics endpoint

## Running Monitoring Stack

To start the monitoring stack:

```bash
cd infrastructure/docker
docker-compose up -d prometheus node-exporter
```

Access the Prometheus UI at: http://localhost:9090

## Grafana Dashboards

Pre-configured dashboards are available in the `grafana/dashboards` directory:
- API Overview
- Admin Panel Overview
- System Metrics 