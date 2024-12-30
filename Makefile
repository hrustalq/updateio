# Variables
DOCKER_COMPOSE = docker compose

# Infra
INFRA_COMPOSE_FILE = infra/docker-compose.yml
INFRA_ENV_FILE = infra/.env

# Backend
BACKEND_API_COMPOSE_FILE = backend/api/docker-compose.yml
BACKEND_API_ENV_FILE = backend/api/.env

BACKEND_TELEGRAM_COMPOSE_FILE = backend/telegram/docker-compose.yml
BACKEND_TELEGRAM_ENV_FILE = backend/telegram/.env

BACKEND_DISCORD_COMPOSE_FILE = backend/discord/docker-compose.yml
BACKEND_DISCORD_ENV_FILE = backend/discord/.env

# Frontend
FRONTEND_ADMIN_COMPOSE_FILE = frontend/admin/docker-compose.yml
FRONTEND_ADMIN_ENV_FILE = frontend/admin/.env

FRONTEND_WEB_COMPOSE_FILE = frontend/web/docker-compose.yml
FRONTEND_WEB_ENV_FILE = frontend/web/.env

FRONTEND_TG_MINIAPP_COMPOSE_FILE = frontend/tg-miniapp/docker-compose.yml
FRONTEND_TG_MINIAPP_ENV_FILE = frontend/tg-miniapp/.env

# Colors
GREEN = \033[0;32m
NC = \033[0m # No Color

# Commands
.PHONY: up-infra down-infra restart-infra ps-infra logs-infra clean-infra help

help:
	@echo "Available commands:"
	@echo "  ${GREEN}make up-infra${NC}        - Start all infrastructure services"
	@echo "  ${GREEN}make down-infra${NC}      - Stop and remove all infrastructure containers"
	@echo "  ${GREEN}make restart-infra${NC}   - Restart all infrastructure services"
	@echo "  ${GREEN}make ps-infra${NC}        - Show running infrastructure containers"
	@echo "  ${GREEN}make logs-infra${NC}      - Show logs from all infrastructure containers"
	@echo "  ${GREEN}make clean-infra${NC}     - Remove all infrastructure containers and volumes"
	@echo "  ${GREEN}make up-api${NC}          - Start all api services"
	@echo "  ${GREEN}make down-api${NC}        - Stop and remove all api containers"
	@echo "  ${GREEN}make restart-api${NC}     - Restart all api services"
	@echo "  ${GREEN}make ps-api${NC}          - Show running api containers"
	@echo "  ${GREEN}make logs-api${NC}        - Show logs from all api containers"
	@echo "  ${GREEN}make clean-api${NC}       - Remove all api containers and volumes"
	@echo "  ${GREEN}make up-telegram${NC}     - Start all telegram services"
	@echo "  ${GREEN}make down-telegram${NC}   - Stop and remove all telegram containers"
	@echo "  ${GREEN}make restart-telegram${NC} - Restart telegram services"
	@echo "  ${GREEN}make ps-telegram${NC}     - Show running telegram containers"
	@echo "  ${GREEN}make logs-telegram${NC}   - Show logs from all telegram containers"
	@echo "  ${GREEN}make clean-telegram${NC}  - Remove all telegram containers and volumes"
	@echo "  ${GREEN}make up-admin${NC}        - Start all admin frontend services"
	@echo "  ${GREEN}make down-admin${NC}      - Stop and remove all admin frontend containers"
	@echo "  ${GREEN}make restart-admin${NC}   - Restart admin frontend services"
	@echo "  ${GREEN}make ps-admin${NC}        - Show running admin frontend containers"
	@echo "  ${GREEN}make logs-admin${NC}      - Show logs from all admin frontend containers"
	@echo "  ${GREEN}make clean-admin${NC}     - Remove all admin frontend containers and volumes"

up-infra:
	@echo "${GREEN}Starting infrastructure services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(INFRA_ENV_FILE) -f $(INFRA_COMPOSE_FILE) up -d

down-infra:
	@echo "${GREEN}Stopping infrastructure services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(INFRA_ENV_FILE) -f $(INFRA_COMPOSE_FILE) down

restart-infra: down-infra up-infra

ps-infra:
	@$(DOCKER_COMPOSE) --env-file $(INFRA_ENV_FILE) -f $(INFRA_COMPOSE_FILE) ps

logs-infra:
	@$(DOCKER_COMPOSE) --env-file $(INFRA_ENV_FILE) -f $(INFRA_COMPOSE_FILE) logs -f

clean-infra:
	@echo "${GREEN}Cleaning up infrastructure services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(INFRA_ENV_FILE) -f $(INFRA_COMPOSE_FILE) down -v --remove-orphans 

up-api:
	@echo "${GREEN}Starting api services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(BACKEND_API_ENV_FILE) -f $(BACKEND_API_COMPOSE_FILE) up -d

down-api:
	@echo "${GREEN}Stopping api services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(BACKEND_API_ENV_FILE) -f $(BACKEND_API_COMPOSE_FILE) down

restart-api: down-api up-api

ps-api:
	@$(DOCKER_COMPOSE) --env-file $(BACKEND_API_ENV_FILE) -f $(BACKEND_API_COMPOSE_FILE) ps

logs-api:
	@$(DOCKER_COMPOSE) --env-file $(BACKEND_API_ENV_FILE) -f $(BACKEND_API_COMPOSE_FILE) logs -f

clean-api:
	@echo "${GREEN}Cleaning up api services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(BACKEND_API_ENV_FILE) -f $(BACKEND_API_COMPOSE_FILE) down -v --remove-orphans 

up-telegram:
	@echo "${GREEN}Starting telegram services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(BACKEND_TELEGRAM_ENV_FILE) -f $(BACKEND_TELEGRAM_COMPOSE_FILE) up -d

down-telegram:
	@echo "${GREEN}Stopping telegram services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(BACKEND_TELEGRAM_ENV_FILE) -f $(BACKEND_TELEGRAM_COMPOSE_FILE) down

restart-telegram: down-telegram up-telegram

ps-telegram:
	@$(DOCKER_COMPOSE) --env-file $(BACKEND_TELEGRAM_ENV_FILE) -f $(BACKEND_TELEGRAM_COMPOSE_FILE) ps

logs-telegram:
	@$(DOCKER_COMPOSE) --env-file $(BACKEND_TELEGRAM_ENV_FILE) -f $(BACKEND_TELEGRAM_COMPOSE_FILE) logs -f

clean-telegram:
	@echo "${GREEN}Cleaning up telegram services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(BACKEND_TELEGRAM_ENV_FILE) -f $(BACKEND_TELEGRAM_COMPOSE_FILE) down -v --remove-orphans 

up-admin:
	@echo "${GREEN}Starting admin frontend services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(FRONTEND_ADMIN_ENV_FILE) -f $(FRONTEND_ADMIN_COMPOSE_FILE) up -d

down-admin:
	@echo "${GREEN}Stopping admin frontend services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(FRONTEND_ADMIN_ENV_FILE) -f $(FRONTEND_ADMIN_COMPOSE_FILE) down

restart-admin: down-admin up-admin

ps-admin:
	@$(DOCKER_COMPOSE) --env-file $(FRONTEND_ADMIN_ENV_FILE) -f $(FRONTEND_ADMIN_COMPOSE_FILE) ps

logs-admin:
	@$(DOCKER_COMPOSE) --env-file $(FRONTEND_ADMIN_ENV_FILE) -f $(FRONTEND_ADMIN_COMPOSE_FILE) logs -f

clean-admin:
	@echo "${GREEN}Cleaning up admin frontend services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(FRONTEND_ADMIN_ENV_FILE) -f $(FRONTEND_ADMIN_COMPOSE_FILE) down -v --remove-orphans 

up-web:
	@echo "${GREEN}Starting web frontend services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(FRONTEND_WEB_ENV_FILE) -f $(FRONTEND_WEB_COMPOSE_FILE) up -d

down-web:
	@echo "${GREEN}Stopping web frontend services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(FRONTEND_WEB_ENV_FILE) -f $(FRONTEND_WEB_COMPOSE_FILE) down

restart-web: down-web up-web

ps-web:
	@$(DOCKER_COMPOSE) --env-file $(FRONTEND_WEB_ENV_FILE) -f $(FRONTEND_WEB_COMPOSE_FILE) ps

logs-web:
	@$(DOCKER_COMPOSE) --env-file $(FRONTEND_WEB_ENV_FILE) -f $(FRONTEND_WEB_COMPOSE_FILE) logs -f

clean-web:
	@echo "${GREEN}Cleaning up web frontend services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(FRONTEND_WEB_ENV_FILE) -f $(FRONTEND_WEB_COMPOSE_FILE) down -v --remove-orphans 

up-tg-miniapp:
	@echo "${GREEN}Starting tg miniapp frontend services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(FRONTEND_TG_MINIAPP_ENV_FILE) -f $(FRONTEND_TG_MINIAPP_COMPOSE_FILE) up -d

down-tg-miniapp:
	@echo "${GREEN}Stopping tg miniapp frontend services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(FRONTEND_TG_MINIAPP_ENV_FILE) -f $(FRONTEND_TG_MINIAPP_COMPOSE_FILE) down

restart-tg-miniapp: down-tg-miniapp up-tg-miniapp

ps-tg-miniapp:
	@$(DOCKER_COMPOSE) --env-file $(FRONTEND_TG_MINIAPP_ENV_FILE) -f $(FRONTEND_TG_MINIAPP_COMPOSE_FILE) ps

logs-tg-miniapp:
	@$(DOCKER_COMPOSE) --env-file $(FRONTEND_TG_MINIAPP_ENV_FILE) -f $(FRONTEND_TG_MINIAPP_COMPOSE_FILE) logs -f

clean-tg-miniapp:
	@echo "${GREEN}Cleaning up tg miniapp frontend services...${NC}"
	@$(DOCKER_COMPOSE) --env-file $(FRONTEND_TG_MINIAPP_ENV_FILE) -f $(FRONTEND_TG_MINIAPP_COMPOSE_FILE) down -v --remove-orphans 