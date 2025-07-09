import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordinatorPannelService } from './coordinator-pannel.service';
import { CoordinatorPannelController } from './coordinator-pannel.controller';
import { Session } from '../tutoring-requests/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  controllers: [CoordinatorPannelController],
  providers: [CoordinatorPannelService],
})
export class CoordinatorPannelModule {}
