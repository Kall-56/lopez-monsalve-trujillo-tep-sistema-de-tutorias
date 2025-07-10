import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordinatorPannelService } from './coordinator-pannel.service';
import { CoordinatorPannelController } from './coordinator-pannel.controller';
import { Sesion } from '../sesion/entities/sesion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sesion])],
  controllers: [CoordinatorPannelController],
  providers: [CoordinatorPannelService],
})
export class CoordinatorPannelModule {}
