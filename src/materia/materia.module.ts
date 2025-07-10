import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materia } from './entities/materia.entity';
import { MateriaController } from './materia.controller';
import { MateriaService } from './materia.service';

@Module({
    imports: [TypeOrmModule.forFeature([Materia])],
    controllers: [MateriaController],
    providers: [MateriaService],
    exports: [TypeOrmModule.forFeature([Materia]), MateriaService],
})
export class MateriaModule {}