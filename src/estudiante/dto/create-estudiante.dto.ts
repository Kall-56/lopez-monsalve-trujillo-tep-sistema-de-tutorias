import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, Max, IsEmail } from 'class-validator';

export class CreateEstudianteDto {
    @ApiProperty({ description: 'Nombre completo del estudiante', example: 'Juan Pérez', required: true })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ description: 'Correo electrónico del estudiante', example: 'juan.perez@email.com', required: true })
    @IsEmail()
    @IsNotEmpty()
    correo: string;

    @ApiProperty({ description: 'Contraseña del estudiante', example: 'password123', required: true })
    @IsString()
    @IsNotEmpty()
    contraseña: string;

    @ApiProperty({ description: 'Cédula del estudiante', example: 'V-12345678', required: true })
    @IsString()
    @IsNotEmpty()
    cedula: string;

    @ApiProperty({ description: 'Carrera del estudiante', example: 'Ingeniería Informática', required: false, nullable: true })
    @IsString()
    @IsOptional()
    carrera?: string;

    @ApiProperty({ description: 'Semestre actual del estudiante', example: 5, required: false, nullable: true })
    @IsInt()
    @IsOptional()
    @Min(1, { message: 'El semestre debe ser al menos 1' })
    @Max(20, { message: 'El semestre no puede ser mayor de 20' }) // Asumiendo un máximo razonable
    semestre?: number;

    @ApiProperty({ description: 'Número de teléfono del estudiante', example: '0412-1234567', required: false, nullable: true })
    @IsString()
    @IsOptional()
    telefono?: string;
}