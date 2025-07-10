import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: true, // Permite todas las origenes en desarrollo
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades que no están definidas en el DTO
    forbidNonWhitelisted: false, // Cambiado a false para permitir propiedades adicionales
    transform: true, // Transforma los tipos de datos de entrada a los tipos definidos en el DTO
  }));

  const config = new DocumentBuilder()
      .setTitle('Sistema de Tutorías Académicas')
      .setDescription('API REST para la gestión de tutorías académicas universitarias')
      .setVersion('1.0')
      .addTag('Gestión de Usuarios')
      .addTag('Autenticación')
      .addTag('Tutoring Requests')
      .addTag('tutorias')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth', // This name here is important for references
      )
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Servidor corriendo en: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Documentación Swagger en: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
