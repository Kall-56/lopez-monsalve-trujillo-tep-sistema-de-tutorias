import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materia } from './entities/materia.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Materia])],
    // controllers: [MateriaController], // Si tienes un controlador para Materia
    // providers: [MateriaService],     // Si tienes un servicio para Materia
    exports: [TypeOrmModule.forFeature([Materia])], // Exporta TypeOrmModule
})
export class MateriaModule {}