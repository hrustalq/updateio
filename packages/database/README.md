# @repo/database

Shared database client and schema for the UpdateIO project.

## Setup

1. Copy `.env.example` to `.env` and update the values
2. Run `pnpm install`
3. Run `pnpm db:generate` to generate the Prisma client
4. Run `pnpm db:push` to sync the database schema

## Usage

```typescript
import { prisma } from '@repo/database';

// Use the client
const games = await prisma.game.findMany();
```

## Available Scripts

- `pnpm build` - Build the package
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate:dev` - Create a new migration
- `pnpm studio` - Open Prisma Studio 