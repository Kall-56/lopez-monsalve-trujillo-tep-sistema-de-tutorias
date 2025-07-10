import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Estudiante, Usuario])],
    exports: [TypeOrmModule.forFeature([Estudiante])],
})
export class EstudianteModule {}