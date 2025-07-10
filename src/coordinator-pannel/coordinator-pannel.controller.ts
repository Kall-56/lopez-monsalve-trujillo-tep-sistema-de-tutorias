import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CoordinatorPannelService } from './coordinator-pannel.service';
import { Sesion } from '../sesion/entities/sesion.entity';

@ApiTags('Panel de Coordinador')
@Controller('coordinator-pannel')
export class CoordinatorPannelController {
  constructor(private readonly coordinatorPannelService: CoordinatorPannelService) {}

  @Get('sessions')
  @ApiOperation({ summary: 'Listar y filtrar sesiones de tutoría' })
  @ApiQuery({ name: 'tutor_id', required: false, type: Number, description: 'Filtrar por ID de tutor' })
  @ApiQuery({ name: 'materia_id', required: false, type: Number, description: 'Filtrar por ID de materia' })
  @ApiQuery({ name: 'fecha', required: false, type: String, description: 'Filtrar por fecha (YYYY-MM-DD)' })
  @ApiQuery({ name: 'completada', required: false, type: Boolean, description: 'Filtrar por estado de completada' })
  @ApiResponse({ status: 200, description: 'Lista de sesiones', type: [Sesion] })
  async findAllSessions(
    @Query('tutor_id') tutor_id?: number,
    @Query('materia_id') materia_id?: number,
    @Query('fecha') fecha?: string,
    @Query('completada') completada?: boolean,
  ): Promise<Sesion[]> {
    try {
      const result = await this.coordinatorPannelService.findAllSessions({ tutor_id, materia_id, fecha, completada });
      // Siempre devolver un array, aunque esté vacío
      console.log('RESULTADO DE SESSIONS:', result);
      return result;
    } catch (error) {
      console.error('ERROR EN SESSIONS:', error);
      throw new HttpException('Error al obtener sesiones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('sessions/statistics')
  @ApiOperation({ summary: 'Obtener estadísticas de sesiones por tutor o materia' })
  @ApiQuery({ name: 'groupBy', enum: ['tutor', 'materia'], required: true, description: 'Agrupar por tutor o materia' })
  @ApiResponse({ status: 200, description: 'Estadísticas de sesiones', schema: { example: [{ tutor_id: 1, cantidad: 5 }] } })
  async getSessionStatistics(
    @Query('groupBy') groupBy: 'tutor' | 'materia',
  ): Promise<any> {
    try {
      const stats = await this.coordinatorPannelService.getSessionStatistics(groupBy);
      // Siempre devolver un array, aunque esté vacío
      return stats;
    } catch (error) {
      if (error.message && error.message.includes('inválido')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
