import { IsString, IsInt, IsNotEmpty, IsOptional, IsUUID, IsDateString, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTutoringRequestsDto {
    @ApiProperty({ 
        description: 'ID del estudiante que solicita la tutoría',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    studentId: string;

    @ApiPropertyOptional({ 
        description: 'ID del tutor asignado (opcional)',
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @IsOptional()
    @IsUUID()
    tutorId?: string;

    @ApiProperty({ 
        description: 'ID de la materia o asignatura',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @IsUUID()
    @IsNotEmpty()
    subjectId: string;

    @ApiProperty({ 
        description: 'Fecha y hora deseada para la tutoría (ISO string)',
        example: '2024-01-15T14:00:00Z'
    })
    @IsDateString()
    @IsNotEmpty()
    requestedDate: string;

    @ApiPropertyOptional({ 
        description: 'Duración de la tutoría en minutos',
        example: 60,
        minimum: 30,
        maximum: 180,
        default: 60
    })
    @IsOptional()
    @IsInt()
    @Min(30)
    @Max(180)
    duration?: number = 60;

    @ApiProperty({ 
        description: 'Descripción del tema o problema a tratar',
        example: 'Necesito ayuda con derivadas e integrales en cálculo diferencial'
    })
    @IsString()
    @IsNotEmpty()
    description: string;
}