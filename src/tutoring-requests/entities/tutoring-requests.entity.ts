import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tutoring_requests')
export class TutoringRequests {
    @ApiProperty({ 
        description: 'ID único de la solicitud de tutoría',
        example: 1,
        readOnly: true
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ 
        description: 'ID del estudiante que solicita la tutoría',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @Column({ type: 'uuid' })
    studentId: string;

    @ApiProperty({ 
        description: 'ID del tutor asignado (opcional)',
        example: '123e4567-e89b-12d3-a456-426614174001',
        required: false
    })
    @Column({ type: 'uuid', nullable: true })
    tutorId?: string;

    @ApiProperty({ 
        description: 'ID de la materia o asignatura',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @Column({ type: 'uuid' })
    subjectId: string;

    @ApiProperty({ 
        description: 'Fecha y hora deseada para la tutoría',
        example: '2024-01-15T14:00:00Z'
    })
    @Column({ type: 'timestamp' })
    requestedDate: Date;

    @ApiProperty({ 
        description: 'Duración de la tutoría en minutos',
        example: 60,
        minimum: 30,
        maximum: 180
    })
    @Column({ type: 'int', default: 60 })
    duration: number;

    @ApiProperty({ 
        description: 'Descripción del tema o problema a tratar',
        example: 'Necesito ayuda con derivadas e integrales en cálculo diferencial'
    })
    @Column({ type: 'text' })
    description: string;

    @ApiProperty({ 
        description: 'Estado de la solicitud',
        example: 'PENDING',
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED']
    })
    @Column({ 
        type: 'enum', 
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    })
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

    @ApiProperty({ 
        description: 'Comentarios adicionales del tutor',
        example: 'Puedo ayudarte con ese tema. Te sugiero revisar primero los conceptos básicos.',
        required: false
    })
    @Column({ type: 'text', nullable: true })
    tutorComments?: string;

    @ApiProperty({ 
        description: 'Calificación de la sesión (1-5)',
        example: 5,
        minimum: 1,
        maximum: 5,
        required: false
    })
    @Column({ type: 'int', nullable: true })
    rating?: number;

    @ApiProperty({ 
        description: 'Comentarios del estudiante sobre la sesión',
        example: 'Excelente tutoría, el tutor explicó muy bien los conceptos.',
        required: false
    })
    @Column({ type: 'text', nullable: true })
    studentFeedback?: string;

    @ApiProperty({ 
        description: 'Fecha de creación de la solicitud',
        example: '2024-01-10T10:30:00Z',
        readOnly: true
    })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ 
        description: 'Fecha de última actualización',
        example: '2024-01-12T15:45:00Z',
        readOnly: true
    })
    @UpdateDateColumn()
    updatedAt: Date;
}