import { IsString, IsOptional, IsNumber, IsObject, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLogDto {
  @ApiProperty({ description: 'ID del usuario que realizó la acción' })
  @IsNumber()
  usuario_id: number;

  @ApiProperty({ description: 'Descripción de la acción realizada' })
  @IsString()
  @MaxLength(255)
  accion: string;

  @ApiPropertyOptional({ description: 'Detalles adicionales de la acción (JSON)' })
  @IsOptional()
  @IsObject()
  detalles?: object;

  @ApiPropertyOptional({ description: 'Fecha y hora del registro del log' })
  @IsOptional()
  fecha?: Date;
} 