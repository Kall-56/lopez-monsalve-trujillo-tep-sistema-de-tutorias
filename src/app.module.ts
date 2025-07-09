import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule} from "@nestjs/typeorm";
import { TutoringRequestsModule } from './tutoring-requests/tutoring-requests.module';
import { CoordinatorPannelModule } from './coordinator-pannel/coordinator-pannel.module';
import { Session } from './tutoring-requests/entities/session.entity';
import { TutoringRequests } from './tutoring-requests/entities/tutoring-requests.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'Topicos',
      entities: [Session, TutoringRequests],
      synchronize: true,
    }),
    TutoringRequestsModule,
    CoordinatorPannelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
