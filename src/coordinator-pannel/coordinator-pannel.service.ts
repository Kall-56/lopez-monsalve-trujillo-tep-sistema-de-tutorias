import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../tutoring-requests/entities/session.entity';

interface SessionFilters {
  tutor_id?: number;
  materia_id?: number;
  fecha?: string;
  completada?: boolean;
}

@Injectable()
export class CoordinatorPannelService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  /**
   * Obtiene todas las sesiones de tutoría, con opción de filtrar por tutor, materia, fecha o estado.
   * @param filters Filtros opcionales: tutor_id, materia_id, fecha, completada
   * @returns Lista de sesiones que cumplen con los filtros
   */
  async findAllSessions(filters: SessionFilters): Promise<Session[]> {
    const query = this.sessionRepository.createQueryBuilder('session');
    if (filters.tutor_id !== undefined) {
      query.andWhere('session.tutor_id = :tutor_id', { tutor_id: filters.tutor_id });
    }
    if (filters.materia_id !== undefined) {
      query.andWhere('session.materia_id = :materia_id', { materia_id: filters.materia_id });
    }
    if (filters.fecha !== undefined) {
      query.andWhere('session.fecha = :fecha', { fecha: filters.fecha });
    }
    if (filters.completada !== undefined) {
      query.andWhere('session.completada = :completada', { completada: filters.completada });
    }
    return query.getMany();
  }

  /**
   * Genera estadísticas simples de sesiones agrupadas por tutor o materia.
   * @param groupBy 'tutor' para agrupar por tutor, 'materia' para agrupar por materia
   * @returns Array con el id y la cantidad de sesiones por grupo
   */
  async getSessionStatistics(groupBy: 'tutor' | 'materia'): Promise<any[]> {
    if (groupBy === 'tutor') {
      return this.sessionRepository.createQueryBuilder('session')
        .select('session.tutor_id', 'tutor_id')
        .addSelect('COUNT(*)', 'cantidad')
        .groupBy('session.tutor_id')
        .getRawMany();
    } else if (groupBy === 'materia') {
      return this.sessionRepository.createQueryBuilder('session')
        .select('session.materia_id', 'materia_id')
        .addSelect('COUNT(*)', 'cantidad')
        .groupBy('session.materia_id')
        .getRawMany();
    } else {
      throw new Error("Parámetro groupBy inválido. Debe ser 'tutor' o 'materia'.");
    }
  }
}
