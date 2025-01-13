import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../app.module';

async function generateDocs() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('UpdateIO Discord Bot')
    .setDescription('The UpdateIO Discord Bot API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const outputPath = join(process.cwd(), 'public', 'swagger.json');

  writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`OpenAPI documentation generated at ${outputPath}`);

  await app.close();
}

generateDocs();
