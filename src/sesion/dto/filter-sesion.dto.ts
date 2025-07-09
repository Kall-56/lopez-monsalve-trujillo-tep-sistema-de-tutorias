import { ApiPropertyOptional } from '@nestjs/swagger';
import {IsOptional, IsInt, IsDateString, IsString, IsBoolean} from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterSesionDto {
    @ApiPropertyOptional({ description: 'Filtrar por ID de tutor', example: 2 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    tutor_id?: number;

    @ApiPropertyOptional({ description: 'Filtrar por ID de estudiante', example: 1 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    estudiante_id?: number;

    @ApiPropertyOptional({ description: 'Filtrar por ID de materia', example: 1 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    materia_id?: number;

    @ApiPropertyOptional({ description: 'Filtrar por fecha específica (YYYY-MM-DD)', example: '2025-07-15' })
    @IsOptional()
    @IsDateString()
    fecha?: string;

    @ApiPropertyOptional({ description: 'Filtrar por estado de completado', example: true })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    completada?: boolean;

    @ApiPropertyOptional({ description: 'Tipo de sesiones a listar: "pasadas", "futuras", "todas"', example: 'futuras' })
    @IsOptional()
    @IsString()
    tipo?: 'pasadas' | 'futuras' | 'todas';
}