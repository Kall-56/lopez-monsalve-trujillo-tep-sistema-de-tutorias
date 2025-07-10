import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  UseGuards, 
  HttpStatus, 
  HttpException,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam, 
  ApiQuery,
  ApiBearerAuth 
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { CreateUsuarioDto } from './usuario/dto/create-usuario.dto';
import { UpdateUsuarioDto } from './usuario/dto/update-usuario.dto';
import { CreateEstudianteDto } from './estudiante/dto/create-estudiante.dto';
import { CreateTutorDto } from './tutor/dto/create-tutor.dto';
import { CreateCoordinadorDto } from './coordinador/dto/create-coordinador.dto';
import { Usuario } from './usuario/entities/usuario.entity';
import { Estudiante } from './estudiante/entities/estudiante.entity';
import { Tutor } from './tutor/entities/tutor.entity';
import { Coordinador } from './coordinador/entities/coordinador.entity';
import { Materia } from './materia/entities/materia.entity';
import { ApiProperty } from '@nestjs/swagger';

// DTOs para el registro de usuarios por tipo
export class RegistroEstudianteDto {
  @ApiProperty({ description: 'Datos del usuario', type: CreateUsuarioDto })
  usuario: CreateUsuarioDto;

  @ApiProperty({ description: 'Datos específicos del estudiante', type: CreateEstudianteDto })
  estudiante: CreateEstudianteDto;
}

export class RegistroTutorDto {
  @ApiProperty({ description: 'Datos del usuario', type: CreateUsuarioDto })
  usuario: CreateUsuarioDto;

  @ApiProperty({ description: 'Datos específicos del tutor', type: CreateTutorDto })
  tutor: CreateTutorDto;
}

export class RegistroCoordinadorDto {
  @ApiProperty({ description: 'Datos del usuario', type: CreateUsuarioDto })
  usuario: CreateUsuarioDto;

  @ApiProperty({ description: 'Datos específicos del coordinador', type: CreateCoordinadorDto })
  coordinador: CreateCoordinadorDto;
}

export class AsignarTutorMateriaDto {
  @ApiProperty({ description: 'ID del tutor', example: 1 })
  tutorId: number;

  @ApiProperty({ description: 'ID de la materia', example: 1 })
  materiaId: number;
}

@ApiTags('Gestión de Usuarios')
@Controller('usuarios')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener mensaje de bienvenida' })
  @ApiResponse({ status: 200, description: 'Mensaje de bienvenida del sistema' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('registro/estudiante')
  @ApiOperation({ summary: 'Registrar un nuevo estudiante' })
  @ApiBody({ type: RegistroEstudianteDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Estudiante registrado exitosamente',
    type: Estudiante 
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Usuario ya existe' })
  async registrarEstudiante(@Body() registroDto: RegistroEstudianteDto): Promise<Estudiante> {
    return this.appService.registrarEstudiante(registroDto);
  }

  @Post('registro/tutor')
  @ApiOperation({ summary: 'Registrar un nuevo tutor' })
  @ApiBody({ type: RegistroTutorDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Tutor registrado exitosamente',
    type: Tutor 
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Usuario ya existe' })
  async registrarTutor(@Body() registroDto: RegistroTutorDto): Promise<Tutor> {
    return this.appService.registrarTutor(registroDto);
  }

  @Post('registro/coordinador')
  @ApiOperation({ summary: 'Registrar un nuevo coordinador' })
  @ApiBody({ type: RegistroCoordinadorDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Coordinador registrado exitosamente',
    type: Coordinador 
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Usuario ya existe' })
  async registrarCoordinador(@Body() registroDto: RegistroCoordinadorDto): Promise<Coordinador> {
    return this.appService.registrarCoordinador(registroDto);
  }

  @Get('perfil/:id')
  @ApiOperation({ summary: 'Obtener perfil de usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil del usuario obtenido exitosamente',
    type: Usuario 
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async obtenerPerfil(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.appService.obtenerPerfil(id);
  }

  @Put('perfil/:id')
  @ApiOperation({ summary: 'Actualizar perfil de usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: 'number' })
  @ApiBody({ type: UpdateUsuarioDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil actualizado exitosamente',
    type: Usuario 
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async actualizarPerfil(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUsuarioDto
  ): Promise<Usuario> {
    return this.appService.actualizarPerfil(id, updateDto);
  }

  @Post('coordinador/asignar-tutor-materia')
  @ApiOperation({ summary: 'Asignar tutor a materia (solo coordinadores)' })
  @ApiBody({ type: AsignarTutorMateriaDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Tutor asignado a materia exitosamente',
    type: Tutor 
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado - Solo coordinadores' })
  @ApiResponse({ status: 404, description: 'Tutor o materia no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async asignarTutorMateria(@Body() asignacionDto: AsignarTutorMateriaDto): Promise<Tutor> {
    return this.appService.asignarTutorMateria(asignacionDto);
  }

  @Get('tutores')
  @ApiOperation({ summary: 'Obtener lista de tutores' })
  @ApiQuery({ name: 'materiaId', required: false, description: 'Filtrar por materia' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tutores obtenida exitosamente',
    type: [Tutor] 
  })
  async obtenerTutores(@Query('materiaId') materiaId?: number): Promise<Tutor[]> {
    return this.appService.obtenerTutores(materiaId);
  }

  @Get('estudiantes')
  @ApiOperation({ summary: 'Obtener lista de estudiantes' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de estudiantes obtenida exitosamente',
    type: [Estudiante] 
  })
  async obtenerEstudiantes(): Promise<Estudiante[]> {
    return this.appService.obtenerEstudiantes();
  }

  @Get('coordinadores')
  @ApiOperation({ summary: 'Obtener lista de coordinadores' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de coordinadores obtenida exitosamente',
    type: [Coordinador] 
  })
  async obtenerCoordinadores(): Promise<Coordinador[]> {
    return this.appService.obtenerCoordinadores();
  }

  @Get('materias')
  @ApiOperation({ summary: 'Obtener lista de materias' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de materias obtenida exitosamente',
    type: [Materia] 
  })
  async obtenerMaterias(): Promise<Materia[]> {
    return this.appService.obtenerMaterias();
  }
}
