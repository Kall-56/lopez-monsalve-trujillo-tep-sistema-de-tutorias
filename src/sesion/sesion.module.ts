import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesionService } from './sesion.service';
import { SesionController } from './sesion.controller';
import { Sesion } from './entities/sesion.entity';
import { Solicitud } from '../solicitud/entities/solicitud.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Materia } from '../materia/entities/materia.entity';
import { Calificacion } from '../calificacion/entities/calificacion.entity';
import { CreateCalificacionDto } from '../calificacion/dto/create-calificacion.dto'; // Asegurarse de que el DTO de calificación está disponible

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Sesion,
            Solicitud,
            Estudiante,
            Tutor,
            Materia,
            Calificacion,
        ]),
    ],
    controllers: [SesionController],
    providers: [SesionService],
    exports: [SesionService], // Si otros módulos necesitan usar SesionService
})
export class SesionModule {}