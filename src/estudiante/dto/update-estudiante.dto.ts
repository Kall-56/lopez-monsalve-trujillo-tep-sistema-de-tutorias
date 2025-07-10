import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateEstudianteDto } from './create-estudiante.dto';
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateEstudianteDto extends PartialType(CreateEstudianteDto) {
    @ApiProperty({ description: 'Nueva cédula del estudiante', example: 'V-87654321', required: false })
    @IsString()
    @IsOptional()
    cedula?: string;

    @ApiProperty({ description: 'Nueva carrera del estudiante', example: 'Ingeniería de Sistemas', required: false })
    @IsString()
    @IsOptional()
    carrera?: string;

    @ApiProperty({ description: 'Nuevo semestre del estudiante', example: 6, required: false })
    @IsInt()
    @IsOptional()
    @Min(1, { message: 'El semestre debe ser al menos 1' })
    @Max(20, { message: 'El semestre no puede ser mayor de 20' })
    semestre?: number;

    @ApiProperty({ description: 'Nuevo número de teléfono del estudiante', example: '0414-7654321', required: false })
    @IsString()
    @IsOptional()
    telefono?: string;
}