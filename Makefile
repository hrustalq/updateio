# Variables
DOCKER_COMPOSE = docker compose
INFRA_COMPOSE_FILE = infra/docker-compose.yml
INFRA_ENV_FILE = infra/.env

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