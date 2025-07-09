import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { Log } from './entities/log.entity';
import { Usuario } from '../usuario/entities/usuario.entity'; // Necesario para el servicio

@Module({
    imports: [TypeOrmModule.forFeature([Log, Usuario])],
    controllers: [LogController],
    providers: [LogService],
    exports: [LogService, TypeOrmModule.forFeature([Log])], // Exportar el servicio y la entidad si se usarán en otros módulos
})
export class LogModule {}