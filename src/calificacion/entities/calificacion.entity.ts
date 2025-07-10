import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Sesion } from '../../sesion/entities/sesion.entity';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Tutor } from '../../tutor/entities/tutor.entity';

@Entity('calificacion')
export class Calificacion {
    @ApiProperty({ description: 'Identificador único de la calificación', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'ID de la sesión a la que pertenece la calificación', example: 1 })
    @Column()
    sesion_id: number;

    @ApiProperty({ description: 'ID del estudiante que califica', example: 1 })
    @Column()
    estudiante_id: number;

    @ApiProperty({ description: 'ID del tutor calificado', example: 2 })
    @Column()
    tutor_id: number;

    @ApiProperty({ description: 'Calificación dada (1-5)', example: 5 })
    @Column({ type: 'integer' })
    calificacion: number;

    @ApiProperty({ description: 'Comentario opcional de la calificación', example: 'Excelente tutoría, muy claro y paciente.' })
    @Column({ type: 'text', nullable: true })
    comentario: string;

    @ApiProperty({ description: 'Fecha y hora de la calificación', example: '2025-07-15T12:30:00.000Z' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;

    @ManyToOne(() => Sesion, sesion => sesion.calificaciones)
    @JoinColumn({ name: 'sesion_id' })
    sesion: Sesion;

    @ManyToOne(() => Estudiante, estudiante => estudiante.calificaciones)
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;

    @ManyToOne(() => Tutor, tutor => tutor.calificaciones)
    @JoinColumn({ name: 'tutor_id' })
    tutor: Tutor;
}