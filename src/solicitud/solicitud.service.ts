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
import { SesionService } from '../sesion/sesion.service'; // Inyectar el servicio de Sesión

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
        private sesionService: SesionService, // Inyectar SesionService
    ) {}


}