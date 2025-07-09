import { Module } from '@nestjs/common';
import { TutoringRequestsService } from './tutoring-requests.service';
import { TutoringRequestsController } from './tutoring-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutoringRequests} from "./entities/tutoring-requests.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TutoringRequests])],
  controllers: [TutoringRequestsController],
  providers: [TutoringRequestsService],
})
export class TutoringRequestsModule {}
