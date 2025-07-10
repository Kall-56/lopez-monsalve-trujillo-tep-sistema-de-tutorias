import { IsOptional, IsString, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryLogsDto {
  @ApiPropertyOptional({ description: 'Filtrar por ID de usuario' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  usuario_id?: number;

  @ApiPropertyOptional({ description: 'Filtrar por acción' })
  @IsOptional()
  @IsString()
  accion?: string;

  @ApiPropertyOptional({ description: 'Fecha de inicio para filtrar logs' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin para filtrar logs' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Número de página', minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Tamaño de página', minimum: 1, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
} 