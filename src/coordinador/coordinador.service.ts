import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coordinador } from './entities/coordinador.entity';
import { CreateCoordinadorDto } from './dto/create-coordinador.dto';
import { UpdateCoordinadorDto } from './dto/update-coordinador.dto';
import { Usuario } from '../usuario/entities/usuario.entity'; // Necesario para verificar el usuario

@Injectable()
export class CoordinadorService {
    constructor(
        @InjectRepository(Coordinador)
        private coordinadorRepository: Repository<Coordinador>,
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) {}
    
}