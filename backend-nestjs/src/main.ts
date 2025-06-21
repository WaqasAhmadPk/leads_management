import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { rateLimiter } from './common/rate-limit.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  
  // Enable Cors
  app.enableCors();
  
  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.use(json());
  app.use(rateLimiter);

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Leads API')
    .setDescription('API documentation for the leads management system')
    .setVersion('1.0')
    .addTag('leads')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI available at /api
  
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
