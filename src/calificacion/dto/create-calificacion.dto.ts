import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCalificacionDto {
    @ApiProperty({ description: 'ID de la sesión de tutoría calificada', example: 1, required: true })
    @IsInt()
    @IsNotEmpty()
    sesion_id: number;

    @ApiProperty({ description: 'ID del estudiante que califica', example: 1, required: true })
    @IsInt()
    @IsNotEmpty()
    estudiante_id: number;

    @ApiProperty({ description: 'ID del tutor calificado', example: 2, required: true })
    @IsInt()
    @IsNotEmpty()
    tutor_id: number;

    @ApiProperty({ description: 'Puntuación de la calificación (entre 1 y 5)', example: 5, required: true })
    @IsInt()
    @IsNotEmpty()
    @Min(1, { message: 'La calificación debe ser al menos 1' })
    @Max(5, { message: 'La calificación no puede ser mayor de 5' })
    calificacion: number;

    @ApiProperty({ description: 'Comentario opcional sobre la calificación', example: 'Excelente tutoría, muy claro y paciente.', required: false, nullable: true })
    @IsString()
    @IsOptional()
    comentario?: string;

    // La fecha se gestiona automáticamente en la entidad por defecto CURRENT_TIMESTAMP
}