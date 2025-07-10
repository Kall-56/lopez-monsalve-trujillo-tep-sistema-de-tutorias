import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Información del sistema',
    description: 'Retorna información básica sobre el Sistema de Tutorías Académicas Universitarias'
  })
  @ApiOkResponse({ 
    description: 'Información del sistema obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'string', 
          example: 'Sistema de Tutorías Académicas Universitarias API' 
        },
        version: { 
          type: 'string', 
          example: '1.0.0' 
        },
        status: { 
          type: 'string', 
          example: 'running' 
        },
        timestamp: { 
          type: 'string', 
          example: '2024-01-15T10:30:00Z' 
        }
      }
    }
  })
  getHello(): object {
    return {
      message: 'Sistema de Tutorías Académicas Universitarias API',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString()
    };
  }
}
