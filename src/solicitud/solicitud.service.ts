import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud, EstadoSolicitud } from './entities/solicitud.entity';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Materia } from '../materia/entities/materia.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Sesion } from '../sesion/entities/sesion.entity';
import { CreateSesionDto } from '../sesion/dto/create-sesion.dto';
import { SesionService } from '../sesion/sesion.service';

@Injectable()
export class SolicitudService {
    constructor(
        @InjectRepository(Solicitud)
        private solicitudRepository: Repository<Solicitud>,
        @InjectRepository(Estudiante)
        private estudianteRepository: Repository<Estudiante>,
        @InjectRepository(Materia)
        private materiaRepository: Repository<Materia>,
        @InjectRepository(Tutor)
        private tutorRepository: Repository<Tutor>,
        @InjectRepository(Sesion)
        private sesionRepository: Repository<Sesion>,
        private sesionService: SesionService,
    ) {}

    /**
     * Crear una nueva solicitud de tutoría
     */
    async create(createSolicitudDto: CreateSolicitudDto): Promise<Solicitud> {
        // Verificar que el estudiante existe
        const estudiante = await this.estudianteRepository.findOne({
            where: { id: createSolicitudDto.estudiante_id }
        });
        if (!estudiante) {
            throw new NotFoundException('Estudiante no encontrado');
        }

        // Verificar que la materia existe
        const materia = await this.materiaRepository.findOne({
            where: { id: createSolicitudDto.materia_id }
        });
        if (!materia) {
            throw new NotFoundException('Materia no encontrada');
        }

        // Verificar que no existe una solicitud pendiente del mismo estudiante para la misma materia y fecha
        const solicitudExistente = await this.solicitudRepository.findOne({
            where: {
                estudiante_id: createSolicitudDto.estudiante_id,
                materia_id: createSolicitudDto.materia_id,
                fecha_solicitada: new Date(createSolicitudDto.fecha_solicitada),
                estado: EstadoSolicitud.PENDIENTE
            }
        });

        if (solicitudExistente) {
            throw new ConflictException('Ya existe una solicitud pendiente para esta materia y fecha');
        }

        // Crear la solicitud
        const solicitud = this.solicitudRepository.create({
            ...createSolicitudDto,
            estado: EstadoSolicitud.PENDIENTE,
            fecha_creacion: new Date()
        });

        return await this.solicitudRepository.save(solicitud);
    }

    /**
     * Obtener todas las solicitudes
     */
    async findAll(): Promise<Solicitud[]> {
        return await this.solicitudRepository.find({
            relations: ['estudiante', 'materia', 'tutor'],
            order: { fecha_creacion: 'DESC' }
        });
    }

    /**
     * Obtener solicitudes por estudiante
     */
    async findByEstudiante(estudianteId: number): Promise<Solicitud[]> {
        return await this.solicitudRepository.find({
            where: { estudiante_id: estudianteId },
            relations: ['estudiante', 'materia', 'tutor'],
            order: { fecha_creacion: 'DESC' }
        });
    }

    /**
     * Obtener solicitudes asignadas a un tutor
     */
    async findByTutor(tutorId: number): Promise<Solicitud[]> {
        return await this.solicitudRepository.find({
            where: { tutor_id: tutorId },
            relations: ['estudiante', 'materia', 'tutor'],
            order: { fecha_creacion: 'DESC' }
        });
    }

    /**
     * Obtener solicitudes por estado
     */
    async findByEstado(estado: EstadoSolicitud): Promise<Solicitud[]> {
        return await this.solicitudRepository.find({
            where: { estado },
            relations: ['estudiante', 'materia', 'tutor'],
            order: { fecha_creacion: 'DESC' }
        });
    }

    /**
     * Obtener una solicitud por ID
     */
    async findOne(id: number): Promise<Solicitud> {
        const solicitud = await this.solicitudRepository.findOne({
            where: { id },
            relations: ['estudiante', 'materia', 'tutor']
        });

        if (!solicitud) {
            throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
        }

        return solicitud;
    }

    /**
     * Actualizar una solicitud
     */
    async update(id: number, updateSolicitudDto: UpdateSolicitudDto): Promise<Solicitud> {
        const solicitud = await this.findOne(id);

        // Si se está cambiando el estado a ACEPTADA, crear una sesión
        if (updateSolicitudDto.estado === EstadoSolicitud.ACEPTADA && solicitud.estado !== EstadoSolicitud.ACEPTADA) {
            if (!solicitud.tutor_id) {
                throw new BadRequestException('No se puede aceptar una solicitud sin tutor asignado');
            }

            // Verificar que no existe ya una sesión para esta solicitud
            const sesionExistente = await this.sesionRepository.findOne({
                where: { solicitud_id: id }
            });

            if (sesionExistente) {
                throw new ConflictException('Ya existe una sesión para esta solicitud');
            }

            // Crear la sesión
            const createSesionDto: CreateSesionDto = {
                solicitud_id: id,
                tutor_id: solicitud.tutor_id,
                estudiante_id: solicitud.estudiante_id,
                materia_id: solicitud.materia_id,
                fecha: (solicitud.fecha_solicitada instanceof Date ? solicitud.fecha_solicitada : new Date(solicitud.fecha_solicitada)).toISOString().split('T')[0],
                hora: solicitud.hora_solicitada
            };

            await this.sesionService.create(createSesionDto);
        }

        // Actualizar la solicitud
        Object.assign(solicitud, updateSolicitudDto);
        return await this.solicitudRepository.save(solicitud);
    }

    /**
     * Aceptar una solicitud (cambia estado a ACEPTADA y crea sesión)
     */
    async aceptarSolicitud(id: number, tutorId: number): Promise<Solicitud> {
        const solicitud = await this.findOne(id);

        if (solicitud.estado !== EstadoSolicitud.PENDIENTE) {
            throw new BadRequestException('Solo se pueden aceptar solicitudes pendientes');
        }

        // Verificar que el tutor existe
        const tutor = await this.tutorRepository.findOne({
            where: { id: tutorId }
        });
        if (!tutor) {
            throw new NotFoundException('Tutor no encontrado');
        }

        // Actualizar la solicitud con el tutor y estado ACEPTADA
        solicitud.tutor_id = tutorId;
        solicitud.estado = EstadoSolicitud.ACEPTADA;

        const solicitudActualizada = await this.solicitudRepository.save(solicitud);

                    // Crear la sesión
            const createSesionDto: CreateSesionDto = {
                solicitud_id: id,
                tutor_id: tutorId,
                estudiante_id: solicitud.estudiante_id,
                materia_id: solicitud.materia_id,
                fecha: (solicitud.fecha_solicitada instanceof Date ? solicitud.fecha_solicitada : new Date(solicitud.fecha_solicitada)).toISOString().split('T')[0],
                hora: solicitud.hora_solicitada
            };

        await this.sesionService.create(createSesionDto);

        return solicitudActualizada;
    }

    /**
     * Rechazar una solicitud
     */
    async rechazarSolicitud(id: number, tutorId: number): Promise<Solicitud> {
        const solicitud = await this.findOne(id);

        if (solicitud.estado !== EstadoSolicitud.PENDIENTE) {
            throw new BadRequestException('Solo se pueden rechazar solicitudes pendientes');
        }

        if (solicitud.tutor_id && solicitud.tutor_id !== tutorId) {
            throw new BadRequestException('Solo el tutor asignado puede rechazar la solicitud');
        }

        solicitud.estado = EstadoSolicitud.RECHAZADA;
        return await this.solicitudRepository.save(solicitud);
    }

    /**
     * Eliminar una solicitud
     */
    async remove(id: number): Promise<void> {
        const solicitud = await this.findOne(id);

        // Verificar que no tenga una sesión asociada
        const sesion = await this.sesionRepository.findOne({
            where: { solicitud_id: id }
        });

        if (sesion) {
            throw new BadRequestException('No se puede eliminar una solicitud que tiene una sesión asociada');
        }

        await this.solicitudRepository.remove(solicitud);
    }
}