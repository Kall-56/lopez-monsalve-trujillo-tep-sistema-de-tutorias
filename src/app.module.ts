import { Module } from '@nestjs/common';
import { TypeOrmModule} from "@nestjs/typeorm";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TutoringRequestsModule } from './tutoring-requests/tutoring-requests.module';
import { SolicitudModule } from './solicitud/solicitud.module';
import { SesionModule } from './sesion/sesion.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { MateriaModule } from './materia/materia.module';
import { TutorModule } from './tutor/tutor.module';
import { CalificacionModule } from './calificacion/calificacion.module';
import { CoordinadorModule } from './coordinador/coordinador.module';
import { LogModule } from './log/log.module';

// Importa todas las entidades para TypeOrmModule.forRootAsync
import { Usuario } from './usuario/entities/usuario.entity';
import { Estudiante } from './estudiante/entities/estudiante.entity';
import { Tutor } from './tutor/entities/tutor.entity';
import { Coordinador } from './coordinador/entities/coordinador.entity';
import { Materia } from './materia/entities/materia.entity';
import { Solicitud } from './solicitud/entities/solicitud.entity';
import { Sesion } from './sesion/entities/sesion.entity';
import { Calificacion } from './calificacion/entities/calificacion.entity';
import { Log } from './log/entities/log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'labs-dbservices01.ucab.edu.ve',
      port: 5432,
      username: 'topicos',
      password: '123456',
      database: 'ProyectoTopicos',
      entities: [
        Usuario,
        Estudiante,
        Tutor,
        Coordinador,
        Materia,
        Solicitud,
        Sesion,
        Calificacion,
        Log
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Usuario,
      Estudiante,
      Tutor,
      Coordinador,
      Materia
    ]),
    TutoringRequestsModule,
    SolicitudModule,
    SesionModule,
    EstudianteModule,
    MateriaModule,
    TutorModule,
    CalificacionModule,
    CoordinadorModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}