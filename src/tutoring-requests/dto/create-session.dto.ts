import { IsInt, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ description: 'ID de la solicitud asociada', example: 10 })
  @IsInt()
  solicitud_id: number;

  @ApiProperty({ description: 'ID del tutor', example: 5 })
  @IsInt()
  tutor_id: number;

  @ApiProperty({ description: 'ID del estudiante', example: 7 })
  @IsInt()
  estudiante_id: number;

  @ApiProperty({ description: 'ID de la materia', example: 3 })
  @IsInt()
  materia_id: number;

  @ApiProperty({ description: 'Fecha de la sesión (YYYY-MM-DD)', example: '2024-06-01' })
  @IsString()
  fecha: string;

  @ApiProperty({ description: 'Hora de la sesión (HH:mm:ss)', example: '14:00:00' })
  @IsString()
  hora: string;

  @ApiPropertyOptional({ description: '¿La sesión fue completada?', example: false })
  @IsOptional()
  @IsBoolean()
  completada?: boolean;
} 