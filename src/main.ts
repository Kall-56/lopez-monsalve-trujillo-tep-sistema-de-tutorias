import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar la validación de DTOs globalmente
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve propiedades que no están definidas en el DTO
    forbidNonWhitelisted: true, // Lanza un error si hay propiedades no permitidas
    transform: true, // Transforma los tipos de datos según el DTO
  }));

  const config = new DocumentBuilder()
      .setTitle('API del Sistema de Tutorias')
      .setDescription('Descripción de la API de Ejemplo')
      .setVersion('0.1')
      .addTag('Tutoring Requests') // Agrega tus etiquetas si las usas en los controladores
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
