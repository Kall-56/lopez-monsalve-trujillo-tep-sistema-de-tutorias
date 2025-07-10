import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, In } from 'typeorm';
import { Log } from './entities/log.entity';
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
   * @returns El log creado
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

      if (filters.method) {
        whereConditions.method = filters.method;
      }

      if (filters.endpoint) {
        whereConditions.endpoint = Like(`%${filters.endpoint}%`);
      }

      if (filters.userId) {
        whereConditions.userId = filters.userId;
      }

      if (filters.userRole) {
        whereConditions.userRole = filters.userRole;
      }

      if (filters.level) {
        whereConditions.level = filters.level;
      }

      if (filters.statusCode) {
        whereConditions.statusCode = filters.statusCode;
      }

      // Filtros de fecha
      if (filters.startDate || filters.endDate) {
        whereConditions.timestamp = Between(
          filters.startDate ? new Date(filters.startDate) : new Date(0),
          filters.endDate ? new Date(filters.endDate) : new Date(),
        );
      }

      const [logs, total] = await this.logRepository.findAndCount({
        where: whereConditions,
        order: { timestamp: 'DESC' },
        skip,
        take: limit,
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
      
      const logsByLevel = await this.logRepository
        .createQueryBuilder('log')
        .select('log.level', 'level')
        .addSelect('COUNT(*)', 'count')
        .groupBy('log.level')
        .getRawMany();

      const logsByMethod = await this.logRepository
        .createQueryBuilder('log')
        .select('log.method', 'method')
        .addSelect('COUNT(*)', 'count')
        .groupBy('log.method')
        .getRawMany();

      const averageResponseTime = await this.logRepository
        .createQueryBuilder('log')
        .select('AVG(log.responseTime)', 'averageResponseTime')
        .getRawOne();

      const errorCount = await this.logRepository.count({
        where: { level: 'ERROR' },
      });

      return {
        totalLogs,
        logsByLevel,
        logsByMethod,
        averageResponseTime: parseFloat(averageResponseTime.averageResponseTime || '0'),
        errorCount,
      };
    } catch (error) {
      this.logger.error(`Error fetching log statistics: ${error.message}`, error.stack);
      throw new BadRequestException('Error fetching log statistics');
    }
  }

  /**
   * Obtiene logs de un usuario específico
   * @param userId - ID del usuario
   * @param limit - Límite de logs a retornar
   * @returns Lista de logs del usuario
   */
  async getUserLogs(userId: string, limit: number = 50) {
    try {
      return await this.logRepository.find({
        where: { userId },
        order: { timestamp: 'DESC' },
        take: limit,
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
        timestamp: Between(new Date(0), thirtyDaysAgo),
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
    if (!createLogDto.method || createLogDto.method.length > 10) {
      throw new BadRequestException('Invalid HTTP method');
    }

    if (!createLogDto.endpoint || createLogDto.endpoint.length > 500) {
      throw new BadRequestException('Invalid endpoint');
    }

    if (createLogDto.statusCode < 100 || createLogDto.statusCode > 599) {
      throw new BadRequestException('Invalid status code');
    }

    if (createLogDto.responseTime < 0) {
      throw new BadRequestException('Response time cannot be negative');
    }

    const validLevels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    if (!validLevels.includes(createLogDto.level)) {
      throw new BadRequestException('Invalid log level');
    }
  }
}
