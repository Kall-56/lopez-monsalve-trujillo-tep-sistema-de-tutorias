import { IsOptional, IsString, IsEnum, IsDateString, IsUUID, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryLogsDto {
  @ApiPropertyOptional({ description: 'Filtrar por método HTTP' })
  @IsOptional()
  @IsString()
  method?: string;

  @ApiPropertyOptional({ description: 'Filtrar por endpoint' })
  @IsOptional()
  @IsString()
  endpoint?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de usuario' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por rol de usuario' })
  @IsOptional()
  @IsString()
  userRole?: string;

  @ApiPropertyOptional({ description: 'Filtrar por nivel de log', enum: ['INFO', 'WARN', 'ERROR', 'DEBUG'] })
  @IsOptional()
  @IsEnum(['INFO', 'WARN', 'ERROR', 'DEBUG'])
  level?: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

  @ApiPropertyOptional({ description: 'Filtrar por código de estado HTTP' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  statusCode?: number;

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