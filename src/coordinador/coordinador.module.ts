import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordinadorService } from './coordinador.service';
import { CoordinadorController } from './coordinador.controller';
import { Coordinador } from './entities/coordinador.entity';
import { Usuario } from '../usuario/entities/usuario.entity'; // Necesario para el servicio

@Module({
    imports: [TypeOrmModule.forFeature([Coordinador, Usuario])],
    controllers: [CoordinadorController],
    providers: [CoordinadorService],
    exports: [CoordinadorService, TypeOrmModule.forFeature([Coordinador])], // Exportar el servicio y la entidad si se usarán en otros módulos
})
export class CoordinadorModule {}