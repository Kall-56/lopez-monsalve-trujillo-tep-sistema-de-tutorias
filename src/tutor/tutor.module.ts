import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutor } from './entities/tutor.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Materia } from '../materia/entities/materia.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Tutor, Usuario, Materia])],
    // controllers: [TutorController],
    // providers: [TutorService],
    exports: [TypeOrmModule.forFeature([Tutor])],
})
export class TutorModule {}