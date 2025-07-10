import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Usuario } from '../usuario/entities/usuario.entity'; // Si necesitas Usuario aquí
// ... Otros imports para el servicio y controlador de estudiante

@Module({
    imports: [TypeOrmModule.forFeature([Estudiante, Usuario])],
    // controllers: [EstudianteController], // Si tienes un controlador para Estudiante
    // providers: [EstudianteService],     // Si tienes un servicio para Estudiante
    exports: [TypeOrmModule.forFeature([Estudiante])], // Exporta TypeOrmModule para que otros módulos lo puedan usar
})
export class EstudianteModule {}