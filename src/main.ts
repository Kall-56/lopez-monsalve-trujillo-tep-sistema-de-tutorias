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
      .setTitle('Sistema de Tutorías Académicas Universitarias')
      .setDescription(`
        API REST para el Sistema de Tutorías Académicas Universitarias.
        
        ## Funcionalidades Principales
        
        ### 🔐 Autenticación y Autorización
        - Sistema de login con JWT
        - Roles: estudiante, tutor, coordinador
        
        ### 👥 Gestión de Usuarios
        - Registro de usuarios por tipo
        - Perfil de usuario
        - Asignación de tutores a materias
        
        ### 📝 Solicitudes de Tutoría
        - Crear solicitudes de tutoría
        - Aceptar/rechazar solicitudes
        - Gestión de sesiones agendadas
        
        ### 📊 Panel del Coordinador
        - Visualización de todas las sesiones
        - Filtros por tutor, materia, fecha
        - Estadísticas de sesiones
        
        ### 📋 Registro de Acciones (Logging)
        - Logging automático de todas las peticiones
        - Programación orientada a aspectos
        - Consulta y análisis de logs
        
        ## Tecnologías
        - **Framework**: NestJS
        - **Lenguaje**: TypeScript
        - **ORM**: TypeORM
        - **Base de Datos**: PostgreSQL
        - **Documentación**: Swagger/OpenAPI
      `)
      .setVersion('1.0.0')
      .addTag('Tutoring Requests', 'Gestión de solicitudes de tutoría')
      .addTag('Logging', 'Sistema de logging y auditoría')
      .addTag('Auth', 'Autenticación y autorización')
      .addTag('Users', 'Gestión de usuarios')
      .addTag('Sessions', 'Gestión de sesiones de tutoría')
      .addTag('Coordinator', 'Panel del coordinador')
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
