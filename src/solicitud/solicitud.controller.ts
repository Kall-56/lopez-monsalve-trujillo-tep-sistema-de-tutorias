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

    @Post()
    @ApiOperation({ summary: 'Crear una nueva solicitud de tutoría' })
    @ApiResponse({ status: 201, description: 'Solicitud creada exitosamente', type: Solicitud })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 404, description: 'Estudiante o materia no encontrada' })
    @ApiResponse({ status: 409, description: 'Ya existe una solicitud pendiente para esta materia y fecha' })
    async create(@Body() createSolicitudDto: CreateSolicitudDto): Promise<Solicitud> {
        return await this.solicitudService.create(createSolicitudDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las solicitudes' })
    @ApiResponse({ status: 200, description: 'Lista de solicitudes obtenida exitosamente', type: [Solicitud] })
    async findAll(): Promise<Solicitud[]> {
        return await this.solicitudService.findAll();
    }

    @Get('estudiante/:estudianteId')
    @ApiOperation({ summary: 'Obtener solicitudes por estudiante' })
    @ApiParam({ name: 'estudianteId', description: 'ID del estudiante', type: 'number' })
    @ApiResponse({ status: 200, description: 'Solicitudes del estudiante obtenidas exitosamente', type: [Solicitud] })
    async findByEstudiante(@Param('estudianteId') estudianteId: string): Promise<Solicitud[]> {
        return await this.solicitudService.findByEstudiante(+estudianteId);
    }

    @Get('tutor/:tutorId')
    @ApiOperation({ summary: 'Obtener solicitudes asignadas a un tutor' })
    @ApiParam({ name: 'tutorId', description: 'ID del tutor', type: 'number' })
    @ApiResponse({ status: 200, description: 'Solicitudes del tutor obtenidas exitosamente', type: [Solicitud] })
    async findByTutor(@Param('tutorId') tutorId: string): Promise<Solicitud[]> {
        return await this.solicitudService.findByTutor(+tutorId);
    }

    @Get('estado/:estado')
    @ApiOperation({ summary: 'Obtener solicitudes por estado' })
    @ApiParam({ name: 'estado', description: 'Estado de las solicitudes', enum: EstadoSolicitud })
    @ApiResponse({ status: 200, description: 'Solicitudes filtradas por estado obtenidas exitosamente', type: [Solicitud] })
    async findByEstado(@Param('estado') estado: EstadoSolicitud): Promise<Solicitud[]> {
        return await this.solicitudService.findByEstado(estado);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una solicitud por ID' })
    @ApiParam({ name: 'id', description: 'ID de la solicitud', type: 'number' })
    @ApiResponse({ status: 200, description: 'Solicitud encontrada', type: Solicitud })
    @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
    async findOne(@Param('id') id: string): Promise<Solicitud> {
        return await this.solicitudService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una solicitud' })
    @ApiParam({ name: 'id', description: 'ID de la solicitud', type: 'number' })
    @ApiResponse({ status: 200, description: 'Solicitud actualizada exitosamente', type: Solicitud })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
    @ApiResponse({ status: 409, description: 'Ya existe una sesión para esta solicitud' })
    async update(
        @Param('id') id: string,
        @Body() updateSolicitudDto: UpdateSolicitudDto,
    ): Promise<Solicitud> {
        return await this.solicitudService.update(+id, updateSolicitudDto);
    }

    @Post(':id/aceptar')
    @ApiOperation({ summary: 'Aceptar una solicitud (cambia estado a ACEPTADA y crea sesión)' })
    @ApiParam({ name: 'id', description: 'ID de la solicitud', type: 'number' })
    @ApiQuery({ name: 'tutorId', description: 'ID del tutor que acepta la solicitud', type: 'number' })
    @ApiResponse({ status: 200, description: 'Solicitud aceptada exitosamente', type: Solicitud })
    @ApiResponse({ status: 400, description: 'Solo se pueden aceptar solicitudes pendientes' })
    @ApiResponse({ status: 404, description: 'Solicitud o tutor no encontrado' })
    async aceptarSolicitud(
        @Param('id') id: string,
        @Query('tutorId') tutorId: string,
    ): Promise<Solicitud> {
        return await this.solicitudService.aceptarSolicitud(+id, +tutorId);
    }

    @Post(':id/rechazar')
    @ApiOperation({ summary: 'Rechazar una solicitud' })
    @ApiParam({ name: 'id', description: 'ID de la solicitud', type: 'number' })
    @ApiQuery({ name: 'tutorId', description: 'ID del tutor que rechaza la solicitud', type: 'number' })
    @ApiResponse({ status: 200, description: 'Solicitud rechazada exitosamente', type: Solicitud })
    @ApiResponse({ status: 400, description: 'Solo se pueden rechazar solicitudes pendientes' })
    @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
    async rechazarSolicitud(
        @Param('id') id: string,
        @Query('tutorId') tutorId: string,
    ): Promise<Solicitud> {
        return await this.solicitudService.rechazarSolicitud(+id, +tutorId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar una solicitud' })
    @ApiParam({ name: 'id', description: 'ID de la solicitud', type: 'number' })
    @ApiResponse({ status: 204, description: 'Solicitud eliminada exitosamente' })
    @ApiResponse({ status: 400, description: 'No se puede eliminar una solicitud que tiene una sesión asociada' })
    @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.solicitudService.remove(+id);
    }
}