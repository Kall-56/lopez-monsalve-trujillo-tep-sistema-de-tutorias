import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingService } from './logging.service';
import { LoggingController } from './logging.controller';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { Log } from '../log/entities/log.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Log]),
  ],
  controllers: [LoggingController],
  providers: [
    LoggingService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [LoggingService],
})
export class LoggingModule {}
