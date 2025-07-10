import { Controller, Get, Param, Query } from '@nestjs/common';
import { LogService } from './log.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Log } from './entities/log.entity';
import { FilterLogDto } from './dto/filter-log.dto';

@ApiTags('Logs')
@Controller('logs')
export class LogController {
    constructor(private readonly logService: LogService) {}


}