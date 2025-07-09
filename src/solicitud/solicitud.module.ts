import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudService } from './solicitud.service';
import { SolicitudController } from './solicitud.controller';
import { Solicitud } from './entities/solicitud.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Materia } from '../materia/entities/materia.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Sesion } from '../sesion/entities/sesion.entity'; // Necesario para el servicio de Solicitud
import { SesionService } from '../sesion/sesion.service'; // Necesario para el servicio de Solicitud
import { Calificacion } from '../calificacion/entities/calificacion.entity'; // Necesario para SesionService

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Solicitud,
            Estudiante,
            Materia,
            Tutor,
            Sesion, // Importar Sesion aquí también porque SolicitudService la usa para crear sesiones
            Calificacion, // Importar Calificacion también porque SesionService la usa
        ]),
    ],
    controllers: [SolicitudController],
    providers: [SolicitudService, SesionService], // Proveer ambos servicios
    exports: [SolicitudService], // Si otros módulos necesitan usar SolicitudService
})
export class SolicitudModule {}