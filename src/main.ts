import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { ValidationFilter } from './exception/validation-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule);
  app.use('/qr-images', express.static(join(__dirname, '..', 'qr-images')));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization,Custom-Header,Organization_id,userModuleRole',
  });
  app.setGlobalPrefix('api');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

   //create swagger ui
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      skipMissingProperties: false,
      skipNullProperties: true,

      exceptionFactory: ValidationFilter,
    }),
  );

  // Create the Swagger API documentation
   const config = new DocumentBuilder()
   .setTitle('MonoParking API') // Title of your API
   .setDescription('API documentation for the MonoParking application') // Description
   .setVersion('1.0') // Version of the API
   .addTag('albums') // Tag for related routes, you can add more tags like 'users', 'subscriptions', etc.
   .addBearerAuth() // If using JWT authentication
   .build();


   const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/swagger', app, document, {
    customSiteTitle: 'MonoParking',
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
