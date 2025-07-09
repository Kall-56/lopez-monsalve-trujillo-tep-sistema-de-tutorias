import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule} from "@nestjs/typeorm";
import { TutoringRequestsModule } from './tutoring-requests/tutoring-requests.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'labs-dbservices01.ucab.edu.ve',
      port: 5432,
      username: 'topicos',
      password: '123456',
      database: 'ProyectoTopicos',
      entities: [],
      synchronize: true,
    }),
    TutoringRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
