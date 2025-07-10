import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Sesion } from './entities/sesion.entity';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';
import { Solicitud, EstadoSolicitud } from '../solicitud/entities/solicitud.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Materia } from '../materia/entities/materia.entity';
import { Calificacion } from '../calificacion/entities/calificacion.entity';
import { CreateCalificacionDto } from '../calificacion/dto/create-calificacion.dto';
import { FilterSesionDto } from './dto/filter-sesion.dto';

@Injectable()
export class SesionService {
    constructor(
        @InjectRepository(Sesion)
        private sesionRepository: Repository<Sesion>,
        @InjectRepository(Solicitud)
        private solicitudRepository: Repository<Solicitud>,
        @InjectRepository(Estudiante)
        private estudianteRepository: Repository<Estudiante>,
        @InjectRepository(Tutor)
        private tutorRepository: Repository<Tutor>,
        @InjectRepository(Materia)
        private materiaRepository: Repository<Materia>,
        @InjectRepository(Calificacion)
        private calificacionRepository: Repository<Calificacion>,
    ) {}

    /**
     * Crear una nueva sesión
     */
    async create(createSesionDto: CreateSesionDto): Promise<Sesion> {
        // Verificar que la solicitud existe y está aceptada
        const solicitud = await this.solicitudRepository.findOne({
            where: { id: createSesionDto.solicitud_id }
        });
        if (!solicitud) {
            throw new NotFoundException('Solicitud no encontrada');
        }
        if (solicitud.estado !== EstadoSolicitud.ACEPTADA) {
            throw new BadRequestException('Solo se pueden crear sesiones para solicitudes aceptadas');
        }

        // Verificar que no existe ya una sesión para esta solicitud
        const sesionExistente = await this.sesionRepository.findOne({
            where: { solicitud_id: createSesionDto.solicitud_id }
        });
        if (sesionExistente) {
            throw new ConflictException('Ya existe una sesión para esta solicitud');
        }

        // Verificar que el estudiante existe
        const estudiante = await this.estudianteRepository.findOne({
            where: { id: createSesionDto.estudiante_id }
        });
        if (!estudiante) {
            throw new NotFoundException('Estudiante no encontrado');
        }

        // Verificar que el tutor existe
        const tutor = await this.tutorRepository.findOne({
            where: { id: createSesionDto.tutor_id }
        });
        if (!tutor) {
            throw new NotFoundException('Tutor no encontrado');
        }

        // Verificar que la materia existe
        const materia = await this.materiaRepository.findOne({
            where: { id: createSesionDto.materia_id }
        });
        if (!materia) {
            throw new NotFoundException('Materia no encontrada');
        }

        // Crear la sesión
        const sesion = this.sesionRepository.create({
            ...createSesionDto,
            fecha: new Date(createSesionDto.fecha),
            completada: false
        });

        return await this.sesionRepository.save(sesion);
    }

    /**
     * Obtener todas las sesiones
     */
    async findAll(): Promise<Sesion[]> {
        return await this.sesionRepository.find({
            relations: ['solicitud', 'tutor', 'estudiante', 'materia'],
            order: { fecha: 'DESC' }
        });
    }

    /**
     * Obtener sesiones con filtros
     */
    async findWithFilters(filters: FilterSesionDto): Promise<Sesion[]> {
        const query = this.sesionRepository.createQueryBuilder('sesion')
            .leftJoinAndSelect('sesion.solicitud', 'solicitud')
            .leftJoinAndSelect('sesion.tutor', 'tutor')
            .leftJoinAndSelect('sesion.estudiante', 'estudiante')
            .leftJoinAndSelect('sesion.materia', 'materia');

        if (filters.tutor_id) {
            query.andWhere('sesion.tutor_id = :tutor_id', { tutor_id: filters.tutor_id });
        }

        if (filters.estudiante_id) {
            query.andWhere('sesion.estudiante_id = :estudiante_id', { estudiante_id: filters.estudiante_id });
        }

        if (filters.materia_id) {
            query.andWhere('sesion.materia_id = :materia_id', { materia_id: filters.materia_id });
        }

        if (filters.fecha) {
            query.andWhere('sesion.fecha = :fecha', { fecha: new Date(filters.fecha) });
        }

        if (filters.completada !== undefined) {
            query.andWhere('sesion.completada = :completada', { completada: filters.completada });
        }

        if (filters.tipo === 'pasadas') {
            query.andWhere('sesion.fecha < :hoy', { hoy: new Date() });
        } else if (filters.tipo === 'futuras') {
            query.andWhere('sesion.fecha >= :hoy', { hoy: new Date() });
        }

        return await query.orderBy('sesion.fecha', 'DESC').getMany();
    }

    /**
     * Obtener sesiones por tutor
     */
    async findByTutor(tutorId: number): Promise<Sesion[]> {
        return await this.sesionRepository.find({
            where: { tutor_id: tutorId },
            relations: ['solicitud', 'tutor', 'estudiante', 'materia'],
            order: { fecha: 'DESC' }
        });
    }

    /**
     * Obtener sesiones por estudiante
     */
    async findByEstudiante(estudianteId: number): Promise<Sesion[]> {
        return await this.sesionRepository.find({
            where: { estudiante_id: estudianteId },
            relations: ['solicitud', 'tutor', 'estudiante', 'materia'],
            order: { fecha: 'DESC' }
        });
    }

    /**
     * Obtener sesiones pasadas
     */
    async findPastSessions(): Promise<Sesion[]> {
        return await this.sesionRepository.find({
            where: { fecha: LessThanOrEqual(new Date()) },
            relations: ['solicitud', 'tutor', 'estudiante', 'materia'],
            order: { fecha: 'DESC' }
        });
    }

    /**
     * Obtener sesiones futuras
     */
    async findFutureSessions(): Promise<Sesion[]> {
        return await this.sesionRepository.find({
            where: { fecha: MoreThanOrEqual(new Date()) },
            relations: ['solicitud', 'tutor', 'estudiante', 'materia'],
            order: { fecha: 'ASC' }
        });
    }

    /**
     * Obtener una sesión por ID
     */
    async findOne(id: number): Promise<Sesion> {
        const sesion = await this.sesionRepository.findOne({
            where: { id },
            relations: ['solicitud', 'tutor', 'estudiante', 'materia']
        });

        if (!sesion) {
            throw new NotFoundException(`Sesión con ID ${id} no encontrada`);
        }

        return sesion;
    }

    /**
     * Actualizar una sesión
     */
    async update(id: number, updateSesionDto: UpdateSesionDto): Promise<Sesion> {
        const sesion = await this.findOne(id);

        // Si se está marcando como completada, verificar que la fecha ya pasó
        if (updateSesionDto.completada && !sesion.completada) {
            if (new Date(sesion.fecha) > new Date()) {
                throw new BadRequestException('No se puede marcar como completada una sesión futura');
            }
        }

        Object.assign(sesion, updateSesionDto);
        return await this.sesionRepository.save(sesion);
    }

    /**
     * Marcar sesión como completada
     */
    async marcarCompletada(id: number, tutorId: number): Promise<Sesion> {
        const sesion = await this.findOne(id);

        if (sesion.tutor_id !== tutorId) {
            throw new BadRequestException('Solo el tutor asignado puede marcar la sesión como completada');
        }

        if (sesion.completada) {
            throw new BadRequestException('La sesión ya está marcada como completada');
        }

        if (new Date(sesion.fecha) > new Date()) {
            throw new BadRequestException('No se puede marcar como completada una sesión futura');
        }

        sesion.completada = true;
        return await this.sesionRepository.save(sesion);
    }

    /**
     * Crear calificación para una sesión
     */
    async crearCalificacion(sesionId: number, createCalificacionDto: CreateCalificacionDto): Promise<Calificacion> {
        const sesion = await this.findOne(sesionId);

        // Verificar que la sesión esté completada
        if (!sesion.completada) {
            throw new BadRequestException('Solo se pueden calificar sesiones completadas');
        }

        // Verificar que no existe ya una calificación para esta sesión
        const calificacionExistente = await this.calificacionRepository.findOne({
            where: { sesion_id: sesionId }
        });
        if (calificacionExistente) {
            throw new ConflictException('Ya existe una calificación para esta sesión');
        }

        // Verificar que el estudiante que califica es el mismo de la sesión
        if (createCalificacionDto.estudiante_id !== sesion.estudiante_id) {
            throw new BadRequestException('Solo el estudiante de la sesión puede calificar');
        }

        // Verificar que el tutor calificado es el mismo de la sesión
        if (createCalificacionDto.tutor_id !== sesion.tutor_id) {
            throw new BadRequestException('El tutor calificado debe ser el mismo de la sesión');
        }

        // Crear la calificación
        const calificacion = this.calificacionRepository.create({
            ...createCalificacionDto,
            sesion_id: sesionId
        });

        return await this.calificacionRepository.save(calificacion);
    }

    /**
     * Eliminar una sesión
     */
    async remove(id: number): Promise<void> {
        const sesion = await this.findOne(id);

        // Verificar que no tenga calificaciones
        const calificaciones = await this.calificacionRepository.find({
            where: { sesion_id: id }
        });

        if (calificaciones.length > 0) {
            throw new BadRequestException('No se puede eliminar una sesión que tiene calificaciones');
        }

        await this.sesionRepository.remove(sesion);
    }
}