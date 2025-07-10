import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MateriaService } from './materia.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { Materia } from './entities/materia.entity';

@ApiTags('Materias')
@Controller('materias')
export class MateriaController {
    constructor(private readonly materiaService: MateriaService) {}

    @Post()
    @ApiOperation({ summary: 'Crear una nueva materia' })
    @ApiResponse({ status: 201, description: 'Materia creada exitosamente', type: Materia })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 409, description: 'Ya existe una materia con este código o nombre' })
    async create(@Body() createMateriaDto: CreateMateriaDto): Promise<Materia> {
        return await this.materiaService.create(createMateriaDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las materias' })
    @ApiResponse({ status: 200, description: 'Lista de materias obtenida exitosamente', type: [Materia] })
    async findAll(): Promise<Materia[]> {
        return await this.materiaService.findAll();
    }

    @Get('buscar')
    @ApiOperation({ summary: 'Buscar materias por nombre' })
    @ApiQuery({ name: 'nombre', description: 'Nombre de la materia a buscar', type: 'string' })
    @ApiResponse({ status: 200, description: 'Materias encontradas', type: [Materia] })
    async findByNombre(@Query('nombre') nombre: string): Promise<Materia[]> {
        return await this.materiaService.findByNombre(nombre);
    }

    @Get('codigo/:codigo')
    @ApiOperation({ summary: 'Obtener una materia por código' })
    @ApiParam({ name: 'codigo', description: 'Código de la materia', type: 'string' })
    @ApiResponse({ status: 200, description: 'Materia encontrada', type: Materia })
    @ApiResponse({ status: 404, description: 'Materia no encontrada' })
    async findByCodigo(@Param('codigo') codigo: string): Promise<Materia> {
        return await this.materiaService.findByCodigo(codigo);
    }

    @Get('estadisticas')
    @ApiOperation({ summary: 'Obtener estadísticas de materias' })
    @ApiResponse({ 
        status: 200, 
        description: 'Estadísticas obtenidas exitosamente',
        schema: {
            example: {
                totalMaterias: 10,
                materiasConTutores: 8,
                materiasSinTutores: 2,
                materiasConSolicitudes: 5,
                porcentajeConTutores: 80
            }
        }
    })
    async getEstadisticas(): Promise<any> {
        return await this.materiaService.getEstadisticas();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una materia por ID' })
    @ApiParam({ name: 'id', description: 'ID de la materia', type: 'number' })
    @ApiResponse({ status: 200, description: 'Materia encontrada', type: Materia })
    @ApiResponse({ status: 404, description: 'Materia no encontrada' })
    async findOne(@Param('id') id: string): Promise<Materia> {
        return await this.materiaService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una materia' })
    @ApiParam({ name: 'id', description: 'ID de la materia', type: 'number' })
    @ApiResponse({ status: 200, description: 'Materia actualizada exitosamente', type: Materia })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 404, description: 'Materia no encontrada' })
    @ApiResponse({ status: 409, description: 'Ya existe una materia con este código o nombre' })
    async update(
        @Param('id') id: string,
        @Body() updateMateriaDto: UpdateMateriaDto,
    ): Promise<Materia> {
        return await this.materiaService.update(+id, updateMateriaDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar una materia' })
    @ApiParam({ name: 'id', description: 'ID de la materia', type: 'number' })
    @ApiResponse({ status: 204, description: 'Materia eliminada exitosamente' })
    @ApiResponse({ status: 400, description: 'No se puede eliminar una materia que tiene tutores, solicitudes o sesiones asociadas' })
    @ApiResponse({ status: 404, description: 'Materia no encontrada' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.materiaService.remove(+id);
    }
} 