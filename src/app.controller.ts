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
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

// DTOs simplificados para el registro de usuarios por tipo
export class RegistroEstudianteDto {
  @ApiProperty({ description: 'Nombre completo del usuario', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'juan.perez@example.com' })
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'MiContraseña123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  contraseña: string;

  @ApiProperty({ description: 'Cédula del estudiante', example: 'V-12345678' })
  @IsString()
  @IsNotEmpty()
  cedula: string;

  @ApiProperty({ description: 'Carrera del estudiante', example: 'Ingeniería Informática', required: false })
  @IsString()
  @IsOptional()
  carrera?: string;

  @ApiProperty({ description: 'Semestre del estudiante', example: 5, required: false })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(20)
  semestre?: number;

  @ApiProperty({ description: 'Teléfono del estudiante', example: '0412-1234567', required: false })
  @IsString()
  @IsOptional()
  telefono?: string;
}

export class RegistroTutorDto {
  @ApiProperty({ description: 'Nombre completo del usuario', example: 'María González' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'maria.gonzalez@example.com' })
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'TutorPass123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  contraseña: string;

  @ApiProperty({ description: 'Cédula del tutor', example: 'V-87654321' })
  @IsString()
  @IsNotEmpty()
  cedula: string;

  @ApiProperty({ description: 'Profesión del tutor', example: 'Ingeniero de Sistemas', required: false })
  @IsString()
  @IsOptional()
  profesion?: string;

  @ApiProperty({ description: 'Experiencia del tutor', example: '5 años de experiencia', required: false })
  @IsString()
  @IsOptional()
  experiencia?: string;

  @ApiProperty({ description: 'Teléfono del tutor', example: '0414-7654321', required: false })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiProperty({ description: 'ID de la materia asignada', example: 1, required: false })
  @IsInt()
  @IsOptional()
  materia_id?: number;
}

export class RegistroCoordinadorDto {
  @ApiProperty({ description: 'Nombre completo del usuario', example: 'Dr. Carlos Rodríguez' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'carlos.rodriguez@example.com' })
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'CoordPass123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  contraseña: string;

  @ApiProperty({ description: 'Cédula del coordinador', example: 'E-98765432' })
  @IsString()
  @IsNotEmpty()
  cedula: string;

  @ApiProperty({ description: 'Departamento del coordinador', example: 'Ciencias Básicas', required: false })
  @IsString()
  @IsOptional()
  departamento?: string;

  @ApiProperty({ description: 'Extensión interna', example: '1234', required: false })
  @IsString()
  @IsOptional()
  extension_interna?: string;
}

export class AsignarTutorMateriaDto {
  @ApiProperty({ description: 'ID del tutor', example: 1 })
  @IsInt()
  @IsNotEmpty()
  tutorId: number;

  @ApiProperty({ description: 'ID de la materia', example: 1 })
  @IsInt()
  @IsNotEmpty()
  materiaId: number;
}

@ApiTags('Gestión de Usuarios')
@Controller('usuarios')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Información del sistema',
    description: 'Retorna información básica sobre el Sistema de Tutorías Académicas Universitarias'
  })
  @ApiOkResponse({ 
    description: 'Información del sistema obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'string', 
          example: 'Sistema de Tutorías Académicas Universitarias API' 
        },
        version: { 
          type: 'string', 
          example: '1.0.0' 
        },
        status: { 
          type: 'string', 
          example: 'running' 
        },
        timestamp: { 
          type: 'string', 
          example: '2024-01-15T10:30:00Z' 
        }
      }
    }
  })
  getHello(): object {
    return {
      message: 'Sistema de Tutorías Académicas Universitarias API',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString()
    };
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
