import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EstudianteService } from './estudiante.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { Estudiante } from './entities/estudiante.entity';

@ApiTags('estudiantes')
@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo estudiante' })
  @ApiResponse({ status: 201, description: 'Estudiante creado exitosamente', type: Estudiante })
  @ApiResponse({ status: 400, description: 'Datos inválidos o estudiante ya existe' })
  async create(@Body() createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
    return await this.estudianteService.create(createEstudianteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los estudiantes' })
  @ApiResponse({ status: 200, description: 'Lista de estudiantes obtenida exitosamente', type: [Estudiante] })
  async findAll(): Promise<Estudiante[]> {
    return await this.estudianteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un estudiante por ID' })
  @ApiParam({ name: 'id', description: 'ID del estudiante', type: 'number' })
  @ApiResponse({ status: 200, description: 'Estudiante encontrado', type: Estudiante })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  async findOne(@Param('id') id: string): Promise<Estudiante> {
    return await this.estudianteService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un estudiante' })
  @ApiParam({ name: 'id', description: 'ID del estudiante', type: 'number' })
  @ApiResponse({ status: 200, description: 'Estudiante actualizado exitosamente', type: Estudiante })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async update(
    @Param('id') id: string,
    @Body() updateEstudianteDto: UpdateEstudianteDto,
  ): Promise<Estudiante> {
    return await this.estudianteService.update(+id, updateEstudianteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un estudiante' })
  @ApiParam({ name: 'id', description: 'ID del estudiante', type: 'number' })
  @ApiResponse({ status: 204, description: 'Estudiante eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.estudianteService.remove(+id);
  }
} 