import { IsString, IsOptional, IsNumber, IsEnum, IsObject, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLogDto {
  @ApiProperty({ description: 'Método HTTP de la petición' })
  @IsString()
  @MaxLength(10)
  method: string;

  @ApiProperty({ description: 'Endpoint de la petición' })
  @IsString()
  @MaxLength(500)
  endpoint: string;

  @ApiPropertyOptional({ description: 'ID del usuario que realizó la petición' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Rol del usuario' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  userRole?: string;

  @ApiPropertyOptional({ description: 'Dirección IP del cliente' })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User Agent del cliente' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Cuerpo de la petición' })
  @IsOptional()
  @IsObject()
  requestBody?: any;

  @ApiPropertyOptional({ description: 'Cuerpo de la respuesta' })
  @IsOptional()
  @IsObject()
  responseBody?: any;

  @ApiProperty({ description: 'Código de estado HTTP' })
  @IsNumber()
  statusCode: number;

  @ApiProperty({ description: 'Tiempo de respuesta en milisegundos' })
  @IsNumber()
  responseTime: number;

  @ApiPropertyOptional({ description: 'Mensaje de error si aplica' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  errorMessage?: string;

  @ApiProperty({ description: 'Nivel del log', enum: ['INFO', 'WARN', 'ERROR', 'DEBUG'] })
  @IsEnum(['INFO', 'WARN', 'ERROR', 'DEBUG'])
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
} 