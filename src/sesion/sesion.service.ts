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


}