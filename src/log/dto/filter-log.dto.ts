import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterLogDto {
    @ApiPropertyOptional({ description: 'Filtrar por ID de usuario', example: 1 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    usuario_id?: number;

    @ApiPropertyOptional({ description: 'Filtrar por palabra clave en la acción', example: 'creacion' })
    @IsOptional()
    @IsString()
    accion?: string;

    @ApiPropertyOptional({ description: 'Filtrar logs a partir de una fecha (YYYY-MM-DD)', example: '2025-07-01' })
    @IsOptional()
    @IsDateString()
    fecha_desde?: string;

    @ApiPropertyOptional({ description: 'Filtrar logs hasta una fecha (YYYY-MM-DD)', example: '2025-07-31' })
    @IsOptional()
    @IsDateString()
    fecha_hasta?: string;
}