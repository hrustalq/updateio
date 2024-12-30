import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../app.module';

async function generateDocs() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription(
      [
        'API documentation for the application.',
        '',
        'Download [swagger.json](/public/swagger.json)',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local environment')
    .addServer('https://api.production.com', 'Production environment')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Ensure public/swagger directory exists
  const swaggerPath = join(__dirname, '..', '..', 'public');
  if (!existsSync(swaggerPath)) {
    mkdirSync(swaggerPath, { recursive: true });
  }

  // Generate swagger.json
  writeFileSync(
    join(swaggerPath, 'swagger.json'),
    JSON.stringify(document, null, 2),
  );

  await app.close();
}

generateDocs();
