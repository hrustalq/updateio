import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

const API_VERSION = '1.0.0';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Telegram Bot API')
    .setDescription(
      `
## Authentication
All endpoints (except those marked as public) require authentication using an API key.
The API key should be provided in the \`X-API-KEY\` header.

## API Key Format
API keys are prefixed with \`tg_\` followed by a 64-character hexadecimal string.
Example: \`tg_1a2b3c4d...\`

## Roles
Some endpoints require specific user roles:
- \`ADMIN\`: Full access to all endpoints
- \`MODERATOR\`: Access to moderation endpoints
- \`USER\`: Basic user access
- \`CLIENT\`: Client-specific access

## Health Checks
Public health check endpoints are available at:
- \`GET /v1/health\`: Basic health status
- \`GET /v1/health/readiness\`: Readiness probe (includes database status)
- \`GET /v1/health/liveness\`: Liveness probe
`,
    )
    .setVersion(API_VERSION)
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-KEY',
        in: 'header',
        description: 'API key for authentication',
      },
      'X-API-KEY',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}
