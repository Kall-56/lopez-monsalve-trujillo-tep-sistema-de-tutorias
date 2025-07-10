import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { Log } from './entities/log.entity';
import { CreateLogDto } from './dto/create-log.dto';
import { Usuario } from '../usuario/entities/usuario.entity';
import { FilterLogDto } from './dto/filter-log.dto';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Log)
        private logRepository: Repository<Log>,
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) {}


}