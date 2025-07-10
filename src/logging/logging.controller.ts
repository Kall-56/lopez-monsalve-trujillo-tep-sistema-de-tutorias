import { 
  Controller, 
  Get, 
  Query, 
  Param, 
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery, 
  ApiParam,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';
import { LoggingService } from './logging.service';
import { QueryLogsDto } from './dto/query-logs.dto';
import { Log } from './entities/log.entity';

@ApiTags('Logging')
@Controller('logging')
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Obtener logs con filtros y paginación',
    description: 'Retorna una lista paginada de logs del sistema con opciones de filtrado avanzado. Permite filtrar por método HTTP, endpoint, usuario, nivel de log, código de estado y fechas.'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (default: 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Tamaño de página (default: 10, max: 100)', example: 20 })
  @ApiQuery({ name: 'method', required: false, type: String, description: 'Filtrar por método HTTP', example: 'POST' })
  @ApiQuery({ name: 'endpoint', required: false, type: String, description: 'Filtrar por endpoint', example: '/tutoring-requests' })
  @ApiQuery({ name: 'userId', required: false, type: String, description: 'Filtrar por ID de usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiQuery({ name: 'userRole', required: false, type: String, description: 'Filtrar por rol de usuario', example: 'student' })
  @ApiQuery({ name: 'level', required: false, enum: ['INFO', 'WARN', 'ERROR', 'DEBUG'], description: 'Filtrar por nivel de log', example: 'ERROR' })
  @ApiQuery({ name: 'statusCode', required: false, type: Number, description: 'Filtrar por código de estado HTTP', example: 400 })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Fecha de inicio (ISO string)', example: '2024-01-01T00:00:00Z' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Fecha de fin (ISO string)', example: '2024-01-31T23:59:59Z' })
  @ApiOkResponse({ 
    description: 'Lista de logs obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        logs: {
          type: 'array',
          items: { $ref: '#/components/schemas/Log' }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 },
            total: { type: 'number', example: 150 },
            totalPages: { type: 'number', example: 8 }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Parámetros de consulta inválidos' })
  async getLogs(@Query() queryDto: QueryLogsDto) {
    return this.loggingService.getLogs(queryDto);
  }

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Obtener estadísticas de logs',
    description: 'Retorna estadísticas agregadas de todos los logs del sistema, incluyendo conteos por nivel, método HTTP, tiempo promedio de respuesta y número de errores.'
  })
  @ApiOkResponse({ 
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalLogs: { type: 'number', example: 1000 },
        logsByLevel: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              level: { type: 'string', example: 'INFO' },
              count: { type: 'number', example: 800 }
            }
          }
        },
        logsByMethod: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              method: { type: 'string', example: 'GET' },
              count: { type: 'number', example: 600 }
            }
          }
        },
        averageResponseTime: { type: 'number', example: 150.5 },
        errorCount: { type: 'number', example: 50 }
      }
    }
  })
  async getLogStatistics() {
    return this.loggingService.getLogStatistics();
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Obtener logs de un usuario específico',
    description: 'Retorna los logs de un usuario en particular, ordenados por fecha de más reciente a más antigua.'
  })
  @ApiParam({ 
    name: 'userId', 
    description: 'ID único del usuario',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Límite de logs a retornar (máximo 50)',
    example: 25
  })
  @ApiOkResponse({ 
    description: 'Logs del usuario obtenidos exitosamente',
    type: [Log]
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiBadRequestResponse({ description: 'ID de usuario inválido' })
  async getUserLogs(
    @Param('userId') userId: string,
    @Query('limit') limit?: number
  ) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const limitValue = limit && limit > 0 && limit <= 50 ? limit : 50;
    return this.loggingService.getUserLogs(userId, limitValue);
  }

  @Get('clean')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Limpiar logs antiguos',
    description: 'Elimina logs con más de 30 días de antigüedad para mantener la base de datos optimizada.'
  })
  @ApiOkResponse({ 
    description: 'Logs antiguos eliminados exitosamente',
    schema: {
      type: 'object',
      properties: {
        deletedCount: { type: 'number', example: 150 },
        message: { type: 'string', example: 'Successfully deleted 150 old logs' }
      }
    }
  })
  async cleanOldLogs() {
    const deletedCount = await this.loggingService.cleanOldLogs();
    return {
      deletedCount,
      message: `Successfully deleted ${deletedCount} old logs`
    };
  }
}
