.PHONY: build
build:
	docker build -t prisma-migrations .

.PHONY: migrate
migrate:
	docker run --rm \
		--network=host \
		-e DATABASE_URL=${DATABASE_URL} \
		-e DIRECT_URL=${DIRECT_URL} \
		prisma-migrations

.PHONY: generate
generate:
	npm run generate

.PHONY: studio
studio:
	npm run studio

.PHONY: studio
studio:
	DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=public" \
	npm run studio 

# Docker compose commands for migrations
.PHONY: migrate-up
migrate:
	docker compose up --build --remove-orphans --abort-on-container-exit && docker compose down
