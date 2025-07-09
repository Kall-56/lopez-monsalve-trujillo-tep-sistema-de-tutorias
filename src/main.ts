import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades que no están definidas en el DTO
    forbidNonWhitelisted: true, // Lanza un error si hay propiedades no definidas
    transform: true, // Transforma los tipos de datos de entrada a los tipos definidos en el DTO
  }));

  const config = new DocumentBuilder()
      .setTitle('API del Sistema de Tutorias')
      .setDescription('Documentación de la API REST para la gestión de tutorías académicas')
      .setVersion('1.0')
      .addTag('Tutoring Requests')
      .addTag('tutorias')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
