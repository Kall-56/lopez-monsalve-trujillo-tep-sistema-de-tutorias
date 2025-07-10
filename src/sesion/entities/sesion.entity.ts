import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Solicitud } from '../../solicitud/entities/solicitud.entity';
import { Tutor } from '../../tutor/entities/tutor.entity';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Materia } from '../../materia/entities/materia.entity';
import { Calificacion } from '../../calificacion/entities/calificacion.entity';

@Entity('sesion')
export class Sesion {
    @ApiProperty({ description: 'Identificador único de la sesión', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'ID de la solicitud asociada (único)', example: 1 })
    @Column({ unique: true })
    solicitud_id: number;

    @ApiProperty({ description: 'ID del tutor de la sesión', example: 2 })
    @Column()
    tutor_id: number;

    @ApiProperty({ description: 'ID del estudiante de la sesión', example: 1 })
    @Column()
    estudiante_id: number;

    @ApiProperty({ description: 'ID de la materia de la sesión', example: 1 })
    @Column()
    materia_id: number;

    @ApiProperty({ description: 'Fecha de la sesión (YYYY-MM-DD)', example: '2025-07-15' })
    @Column({ type: 'date' })
    fecha: Date;

    @ApiProperty({ description: 'Hora de la sesión (HH:MM:SS)', example: '10:00:00' })
    @Column({ type: 'time' })
    hora: string; // Se almacena como string para manejar el tipo TIME de PostgreSQL

    @ApiProperty({ description: 'Indica si la sesión ha sido completada', example: false })
    @Column({ type: 'boolean', default: false })
    completada: boolean;

    @OneToOne(() => Solicitud, solicitud => solicitud.sesion)
    @JoinColumn({ name: 'solicitud_id' })
    solicitud: Solicitud;

    @ManyToOne(() => Tutor, tutor => tutor.sesionesComoTutor)
    @JoinColumn({ name: 'tutor_id' })
    tutor: Tutor;

    @ManyToOne(() => Estudiante, estudiante => estudiante.sesiones)
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;

    @ManyToOne(() => Materia, materia => materia.sesiones)
    @JoinColumn({ name: 'materia_id' })
    materia: Materia;

    @OneToMany(() => Calificacion, calificacion => calificacion.sesion)
    calificaciones: Calificacion[];
}