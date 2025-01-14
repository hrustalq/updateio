import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../app.module';

const API_VERSION = '1.0.0';

async function generateDocs() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Telegram Bot API')
    .setDescription('The UpdateIO Telegram Bot API description')
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

  const document = SwaggerModule.createDocument(app, config);
  const outputPath = join(process.cwd(), 'public', 'swagger.json');

  writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`OpenAPI documentation generated at ${outputPath}`);

  await app.close();
}

generateDocs();
