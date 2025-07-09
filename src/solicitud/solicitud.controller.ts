import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SolicitudService } from './solicitud.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Solicitud, EstadoSolicitud } from './entities/solicitud.entity';

@ApiTags('Solicitudes')
@Controller('solicitudes')
export class SolicitudController {
    constructor(private readonly solicitudService: SolicitudService) {}


}