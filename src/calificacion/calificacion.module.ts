import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calificacion } from './entities/calificacion.entity';
import { Sesion } from '../sesion/entities/sesion.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Tutor } from '../tutor/entities/tutor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Calificacion, Sesion, Estudiante, Tutor])],
    // controllers: [CalificacionController],
    // providers: [CalificacionService],
    exports: [TypeOrmModule.forFeature([Calificacion])],
})
export class CalificacionModule {}