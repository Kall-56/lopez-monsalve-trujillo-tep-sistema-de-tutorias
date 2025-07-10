import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Materia } from '../../materia/entities/materia.entity';
import { Tutor } from '../../tutor/entities/tutor.entity';
import { Sesion } from '../../sesion/entities/sesion.entity';

export enum EstadoSolicitud {
    PENDIENTE = 'PENDIENTE',
    ACEPTADA = 'ACEPTADA',
    RECHAZADA = 'RECHAZADA',
}

@Entity('solicitud')
export class Solicitud {
    @ApiProperty({ description: 'Identificador único de la solicitud', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'ID del estudiante que realiza la solicitud', example: 1 })
    @Column()
    estudiante_id: number;

    @ApiProperty({ description: 'ID de la materia solicitada', example: 1 })
    @Column()
    materia_id: number;

    @ApiProperty({ description: 'Fecha de la tutoría solicitada (YYYY-MM-DD)', example: '2025-07-15' })
    @Column({ type: 'date' })
    fecha_solicitada: Date;

    @ApiProperty({ description: 'Hora de la tutoría solicitada (HH:MM:SS)', example: '10:00:00' })
    @Column({ type: 'time' })
    hora_solicitada: string; // Se almacena como string para manejar el tipo TIME de PostgreSQL

    @ApiProperty({
        description: 'Estado actual de la solicitud',
        enum: EstadoSolicitud,
        example: EstadoSolicitud.PENDIENTE,
    })
    @Column({ length: 20 })
    estado: EstadoSolicitud;

    @ApiProperty({ description: 'ID del tutor asignado (opcional)', example: 2, nullable: true })
    @Column({ nullable: true })
    tutor_id: number;

    @ApiProperty({ description: 'Fecha y hora de creación de la solicitud', example: '2025-07-09T10:00:00.000Z' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion: Date;

    @ManyToOne(() => Estudiante, estudiante => estudiante.solicitudes)
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;

    @ManyToOne(() => Materia, materia => materia.solicitudes)
    @JoinColumn({ name: 'materia_id' })
    materia: Materia;

    @ManyToOne(() => Tutor, tutor => tutor.solicitudesAsignadas, { nullable: true })
    @JoinColumn({ name: 'tutor_id' })
    tutor: Tutor;

    @OneToOne(() => Sesion, sesion => sesion.solicitud)
    sesion: Sesion;
}