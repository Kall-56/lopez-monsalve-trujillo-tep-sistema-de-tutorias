import { ApiProperty, ApiPropertyOptional, ApiExtraModels } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export enum UserRole {
  ESTUDIANTE = 'estudiante',
  TUTOR = 'tutor',
  COORDINADOR = 'coordinador',
}

@ApiExtraModels()
export class RegisterDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  correo: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 6,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contraseña: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: UserRole,
    example: UserRole.ESTUDIANTE,
  })
  @IsEnum(UserRole, { message: 'El rol debe ser estudiante, tutor o coordinador' })
  @IsNotEmpty({ message: 'El rol es requerido' })
  rol: UserRole;

  // CAMPOS OPCIONALES GENERALES (según el rol serán requeridos en validación de servicio)
  @ApiPropertyOptional({
    description: 'Cédula (obligatorio para estudiante, tutor y coordinador)',
    example: 'V-12345678',
  })
  @IsOptional()
  @IsString({ message: 'La cédula debe ser una cadena de texto' })
  cedula?: string;

  @ApiPropertyOptional({
    description: 'Teléfono (opcional para estudiante y tutor)',
    example: '04121234567',
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  telefono?: string;

  // SOLO ESTUDIANTE
  @ApiPropertyOptional({
    description: 'Carrera (opcional para estudiante)',
    example: 'Ingeniería Informática',
  })
  @IsOptional()
  @IsString({ message: 'La carrera debe ser una cadena de texto' })
  carrera?: string;

  @ApiPropertyOptional({
    description: 'Semestre actual (opcional para estudiante)',
    example: 5,
  })
  @IsOptional()
  semestre?: number;

  // SOLO TUTOR
  @ApiPropertyOptional({
    description: 'Profesión (opcional para tutor)',
    example: 'Matemático',
  })
  @IsOptional()
  @IsString({ message: 'La profesión debe ser una cadena de texto' })
  profesion?: string;

  @ApiPropertyOptional({
    description: 'Experiencia (opcional para tutor)',
    example: '5 años enseñando matemáticas',
  })
  @IsOptional()
  @IsString({ message: 'La experiencia debe ser una cadena de texto' })
  experiencia?: string;

  // SOLO COORDINADOR
  @ApiPropertyOptional({
    description: 'Departamento (opcional para coordinador)',
    example: 'Ciencias Básicas',
  })
  @IsOptional()
  @IsString({ message: 'El departamento debe ser una cadena de texto' })
  departamento?: string;

  @ApiPropertyOptional({
    description: 'Extensión interna del teléfono (opcional para coordinador)',
    example: '1234',
  })
  @IsOptional()
  @IsString({ message: 'La extensión debe ser una cadena de texto' })
  extension_interna?: string;
}

export const RegisterDtoExamples = {
  estudiante: {
    summary: 'Registro de estudiante',
    value: {
      nombre: 'Juan Pérez',
      correo: 'juan.perez@example.com',
      contraseña: 'password123',
      rol: 'estudiante',
      cedula: 'V-12345678',
      carrera: 'Ingeniería Informática',
      semestre: 5,
      telefono: '04121234567',
    },
  },
  tutor: {
    summary: 'Registro de tutor',
    value: {
      nombre: 'Ana Torres',
      correo: 'ana.torres@example.com',
      contraseña: 'password123',
      rol: 'tutor',
      cedula: '12345678',
      profesion: 'Matemático',
      experiencia: '5 años enseñando matemáticas',
      telefono: '04141234567',
    },
  },
  coordinador: {
    summary: 'Registro de coordinador',
    value: {
      nombre: 'Carlos Ruiz',
      correo: 'carlos.ruiz@example.com',
      contraseña: 'password123',
      rol: 'coordinador',
      cedula: '87654321',
      departamento: 'Ciencias Básicas',
      extension_interna: '1234',
    },
  },
}; 