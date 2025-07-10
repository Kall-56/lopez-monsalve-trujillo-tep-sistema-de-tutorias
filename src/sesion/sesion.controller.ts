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

    @Get()
    @ApiOperation({ summary: 'Obtener todas las sesiones' })
    @ApiResponse({ status: 200, description: 'Lista de sesiones obtenida exitosamente', type: [Sesion] })
    async findAll(): Promise<Sesion[]> {
        return await this.sesionService.findAll();
    }

    @Get('filtros')
    @ApiOperation({ summary: 'Obtener sesiones con filtros' })
    @ApiQuery({ name: 'tutor_id', required: false, type: Number, description: 'Filtrar por ID de tutor' })
    @ApiQuery({ name: 'estudiante_id', required: false, type: Number, description: 'Filtrar por ID de estudiante' })
    @ApiQuery({ name: 'materia_id', required: false, type: Number, description: 'Filtrar por ID de materia' })
    @ApiQuery({ name: 'fecha', required: false, type: String, description: 'Filtrar por fecha (YYYY-MM-DD)' })
    @ApiQuery({ name: 'completada', required: false, type: Boolean, description: 'Filtrar por estado de completada' })
    @ApiQuery({ name: 'tipo', required: false, enum: ['pasadas', 'futuras'], description: 'Filtrar por tipo: pasadas o futuras' })
    @ApiResponse({ status: 200, description: 'Sesiones filtradas obtenidas exitosamente', type: [Sesion] })
    async findWithFilters(@Query() filters: FilterSesionDto): Promise<Sesion[]> {
        return await this.sesionService.findWithFilters(filters);
    }

    @Get('tutor/:tutorId')
    @ApiOperation({ summary: 'Obtener sesiones por tutor' })
    @ApiParam({ name: 'tutorId', description: 'ID del tutor', type: 'number' })
    @ApiResponse({ status: 200, description: 'Sesiones del tutor obtenidas exitosamente', type: [Sesion] })
    async findByTutor(@Param('tutorId') tutorId: string): Promise<Sesion[]> {
        return await this.sesionService.findByTutor(+tutorId);
    }

    @Get('estudiante/:estudianteId')
    @ApiOperation({ summary: 'Obtener sesiones por estudiante' })
    @ApiParam({ name: 'estudianteId', description: 'ID del estudiante', type: 'number' })
    @ApiResponse({ status: 200, description: 'Sesiones del estudiante obtenidas exitosamente', type: [Sesion] })
    async findByEstudiante(@Param('estudianteId') estudianteId: string): Promise<Sesion[]> {
        return await this.sesionService.findByEstudiante(+estudianteId);
    }

    @Get('pasadas')
    @ApiOperation({ summary: 'Obtener sesiones pasadas' })
    @ApiResponse({ status: 200, description: 'Sesiones pasadas obtenidas exitosamente', type: [Sesion] })
    async findPastSessions(): Promise<Sesion[]> {
        return await this.sesionService.findPastSessions();
    }

    @Get('futuras')
    @ApiOperation({ summary: 'Obtener sesiones futuras' })
    @ApiResponse({ status: 200, description: 'Sesiones futuras obtenidas exitosamente', type: [Sesion] })
    async findFutureSessions(): Promise<Sesion[]> {
        return await this.sesionService.findFutureSessions();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una sesión por ID' })
    @ApiParam({ name: 'id', description: 'ID de la sesión', type: 'number' })
    @ApiResponse({ status: 200, description: 'Sesión encontrada', type: Sesion })
    @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
    async findOne(@Param('id') id: string): Promise<Sesion> {
        return await this.sesionService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una sesión' })
    @ApiParam({ name: 'id', description: 'ID de la sesión', type: 'number' })
    @ApiResponse({ status: 200, description: 'Sesión actualizada exitosamente', type: Sesion })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
    async update(
        @Param('id') id: string,
        @Body() updateSesionDto: UpdateSesionDto,
    ): Promise<Sesion> {
        return await this.sesionService.update(+id, updateSesionDto);
    }

    @Post(':id/completar')
    @ApiOperation({ summary: 'Marcar sesión como completada' })
    @ApiParam({ name: 'id', description: 'ID de la sesión', type: 'number' })
    @ApiQuery({ name: 'tutorId', description: 'ID del tutor que marca como completada', type: 'number' })
    @ApiResponse({ status: 200, description: 'Sesión marcada como completada exitosamente', type: Sesion })
    @ApiResponse({ status: 400, description: 'Solo el tutor asignado puede marcar la sesión como completada' })
    @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
    async marcarCompletada(
        @Param('id') id: string,
        @Query('tutorId') tutorId: string,
    ): Promise<Sesion> {
        return await this.sesionService.marcarCompletada(+id, +tutorId);
    }

    @Post(':id/calificar')
    @ApiOperation({ summary: 'Crear calificación para una sesión' })
    @ApiParam({ name: 'id', description: 'ID de la sesión', type: 'number' })
    @ApiResponse({ status: 201, description: 'Calificación creada exitosamente', type: Calificacion })
    @ApiResponse({ status: 400, description: 'Solo se pueden calificar sesiones completadas' })
    @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
    @ApiResponse({ status: 409, description: 'Ya existe una calificación para esta sesión' })
    async crearCalificacion(
        @Param('id') id: string,
        @Body() createCalificacionDto: CreateCalificacionDto,
    ): Promise<Calificacion> {
        return await this.sesionService.crearCalificacion(+id, createCalificacionDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar una sesión' })
    @ApiParam({ name: 'id', description: 'ID de la sesión', type: 'number' })
    @ApiResponse({ status: 204, description: 'Sesión eliminada exitosamente' })
    @ApiResponse({ status: 400, description: 'No se puede eliminar una sesión que tiene calificaciones' })
    @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.sesionService.remove(+id);
    }
}