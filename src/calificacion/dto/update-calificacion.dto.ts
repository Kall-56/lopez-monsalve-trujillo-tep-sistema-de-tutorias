import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateCalificacionDto } from './create-calificacion.dto';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateCalificacionDto extends PartialType(CreateCalificacionDto) {
    @ApiProperty({ description: 'Nueva puntuación de la calificación (entre 1 y 5)', example: 4, required: false })
    @IsInt()
    @IsOptional()
    @Min(1, { message: 'La calificación debe ser al menos 1' })
    @Max(5, { message: 'La calificación no puede ser mayor de 5' })
    calificacion?: number;

    @ApiProperty({ description: 'Nuevo comentario opcional sobre la calificación', example: 'Muy buena tutoría, aunque un poco rápida.', required: false })
    @IsString()
    @IsOptional()
    comentario?: string;

    // Los IDs de sesión, estudiante y tutor no deberían cambiarse en una actualización de calificación
    // Si necesitas cambiar la relación, deberías eliminar la calificación existente y crear una nueva.
}