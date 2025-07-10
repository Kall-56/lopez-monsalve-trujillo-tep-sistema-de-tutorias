import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateEstudianteDto {
    @ApiProperty({ description: 'ID del usuario asociado a este estudiante', example: 1, required: true })
    @IsInt()
    @IsNotEmpty()
    id: number; // El ID del usuario que será estudiante

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