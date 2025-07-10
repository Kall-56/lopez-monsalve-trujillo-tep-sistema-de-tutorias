import { IsString, IsInt, IsOptional, IsUUID, IsDateString, Min, Max, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTutoringRequestsDto {
    @ApiPropertyOptional({ 
        description: 'ID del estudiante que solicita la tutoría',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsOptional()
    @IsUUID()
    studentId?: string;

    @ApiPropertyOptional({ 
        description: 'ID del tutor asignado',
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @IsOptional()
    @IsUUID()
    tutorId?: string;

    @ApiPropertyOptional({ 
        description: 'ID de la materia o asignatura',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @IsOptional()
    @IsUUID()
    subjectId?: string;

    @ApiPropertyOptional({ 
        description: 'Fecha y hora deseada para la tutoría (ISO string)',
        example: '2024-01-15T14:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    requestedDate?: string;

    @ApiPropertyOptional({ 
        description: 'Duración de la tutoría en minutos',
        example: 60,
        minimum: 30,
        maximum: 180
    })
    @IsOptional()
    @IsInt()
    @Min(30)
    @Max(180)
    duration?: number;

    @ApiPropertyOptional({ 
        description: 'Descripción del tema o problema a tratar',
        example: 'Necesito ayuda con derivadas e integrales en cálculo diferencial'
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ 
        description: 'Estado de la solicitud',
        example: 'ACCEPTED',
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED']
    })
    @IsOptional()
    @IsEnum(['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'])
    status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

    @ApiPropertyOptional({ 
        description: 'Comentarios adicionales del tutor',
        example: 'Puedo ayudarte con ese tema. Te sugiero revisar primero los conceptos básicos.'
    })
    @IsOptional()
    @IsString()
    tutorComments?: string;

    @ApiPropertyOptional({ 
        description: 'Calificación de la sesión (1-5)',
        example: 5,
        minimum: 1,
        maximum: 5
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @ApiPropertyOptional({ 
        description: 'Comentarios del estudiante sobre la sesión',
        example: 'Excelente tutoría, el tutor explicó muy bien los conceptos.'
    })
    @IsOptional()
    @IsString()
    studentFeedback?: string;
} 