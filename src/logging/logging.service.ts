import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, In } from 'typeorm';
import { Log } from '../log/entities/log.entity';
import { CreateLogDto } from './dto/create-log.dto';
import { QueryLogsDto } from './dto/query-logs.dto';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  /**
   * Crea un nuevo log en la base de datos
   * @param createLogDto - Datos del log a crear
   * @returns El log generado
   */
  async createLog(createLogDto: CreateLogDto): Promise<Log> {
    try {
      // Validación adicional a nivel de servicio
      this.validateLogData(createLogDto);

      const log = this.logRepository.create(createLogDto);
      const savedLog = await this.logRepository.save(log);
      
      this.logger.debug(`Log created with ID: ${savedLog.id}`);
      return savedLog;
    } catch (error) {
      this.logger.error(`Error creating log: ${error.message}`, error.stack);
      throw new BadRequestException('Error creating log');
    }
  }

  /**
   * Crea un log de petición HTTP
   * @param data - Datos de la petición
   * @returns El log creado
   */
  async createRequestLog(data: CreateLogDto) {
    // No guardar log si no hay usuario autenticado
    if (!data.usuario_id) {
      return;
    }
    try {
      const log = this.logRepository.create(data);
      const saved = await this.logRepository.save(log);
      this.logger.debug(`Log created with ID: ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error('Error creating request log:', error);
      throw new BadRequestException('Error creating request log');
    }
  }

  /**
   * Obtiene logs con filtros y paginación
   * @param queryDto - Parámetros de consulta
   * @returns Lista paginada de logs
   */
  async getLogs(queryDto: QueryLogsDto) {
    try {
      const { page = 1, limit = 10, ...filters } = queryDto;
      const skip = (page - 1) * limit;

      // Construir query con filtros
      const whereConditions: any = {};

      if (filters.usuario_id) {
        whereConditions.usuario_id = filters.usuario_id;
      }

      if (filters.accion) {
        whereConditions.accion = Like(`%${filters.accion}%`);
      }

      // Filtros de fecha
      if (filters.startDate || filters.endDate) {
        whereConditions.fecha = Between(
          filters.startDate ? new Date(filters.startDate) : new Date(0),
          filters.endDate ? new Date(filters.endDate) : new Date(),
        );
      }

      const [logs, total] = await this.logRepository.findAndCount({
        where: whereConditions,
        order: { fecha: 'DESC' },
        skip,
        take: limit,
        relations: ['usuario']
      });

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Error fetching logs: ${error.message}`, error.stack);
      throw new BadRequestException('Error fetching logs');
    }
  }

  /**
   * Obtiene estadísticas de logs
   * @returns Estadísticas agregadas
   */
  async getLogStatistics() {
    try {
      const totalLogs = await this.logRepository.count();
      
      const logsByUsuario = await this.logRepository
        .createQueryBuilder('log')
        .select('log.usuario_id', 'usuario_id')
        .addSelect('COUNT(*)', 'count')
        .groupBy('log.usuario_id')
        .getRawMany();

      const logsByAccion = await this.logRepository
        .createQueryBuilder('log')
        .select('log.accion', 'accion')
        .addSelect('COUNT(*)', 'count')
        .groupBy('log.accion')
        .getRawMany();

      const errorCount = await this.logRepository
        .createQueryBuilder('log')
        .where("log.detalles->>'statusCode' >= '400'")
        .getCount();

      return {
        totalLogs,
        logsByUsuario,
        logsByAccion,
        errorCount,
      };
    } catch (error) {
      this.logger.error(`Error fetching log statistics: ${error.message}`, error.stack);
      throw new BadRequestException('Error fetching log statistics');
    }
  }

  /**
   * Obtiene logs de un usuario específico
   * @param usuarioId - ID del usuario
   * @param limit - Límite de logs a retornar
   * @returns Lista de logs del usuario
   */
  async getUserLogs(usuarioId: number, limit: number = 50) {
    try {
      return await this.logRepository.find({
        where: { usuario_id: usuarioId },
        order: { fecha: 'DESC' },
        take: limit,
        relations: ['usuario']
      });
    } catch (error) {
      this.logger.error(`Error fetching user logs: ${error.message}`, error.stack);
      throw new BadRequestException('Error fetching user logs');
    }
  }

  /**
   * Limpia logs antiguos (más de 30 días)
   * @returns Número de logs eliminados
   */
  async cleanOldLogs(): Promise<number> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await this.logRepository.delete({
        fecha: Between(new Date(0), thirtyDaysAgo),
      });

      this.logger.log(`Cleaned ${result.affected} old logs`);
      return result.affected || 0;
    } catch (error) {
      this.logger.error(`Error cleaning old logs: ${error.message}`, error.stack);
      throw new BadRequestException('Error cleaning old logs');
    }
  }

  /**
   * Valida los datos del log antes de guardar
   * @param createLogDto - Datos a validar
   */
  private validateLogData(createLogDto: CreateLogDto): void {
    if (!createLogDto.usuario_id) {
      throw new BadRequestException('Usuario ID is required');
    }

    if (!createLogDto.accion || createLogDto.accion.length > 255) {
      throw new BadRequestException('Invalid action');
    }
  }
}
