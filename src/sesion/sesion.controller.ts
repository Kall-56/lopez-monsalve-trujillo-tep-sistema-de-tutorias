import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SesionService } from './sesion.service';
import { UpdateSesionDto } from './dto/update-sesion.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Sesion } from './entities/sesion.entity';
import { CreateCalificacionDto } from '../calificacion/dto/create-calificacion.dto';
import { Calificacion } from '../calificacion/entities/calificacion.entity';
import { FilterSesionDto } from './dto/filter-sesion.dto';

@ApiTags('Sesiones')
@Controller('sesiones')
export class SesionController {
    constructor(private readonly sesionService: SesionService) {}


}