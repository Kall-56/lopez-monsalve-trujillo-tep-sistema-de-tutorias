import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { EstudianteController } from './estudiante.controller';
import { EstudianteService } from './estudiante.service';

@Module({
    imports: [TypeOrmModule.forFeature([Estudiante, Usuario])],
    controllers: [EstudianteController],
    providers: [EstudianteService],
    exports: [TypeOrmModule.forFeature([Estudiante]), EstudianteService],
})
export class EstudianteModule {}