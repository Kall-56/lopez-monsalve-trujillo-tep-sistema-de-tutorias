import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Materia } from '../../materia/entities/materia.entity';
import { Solicitud } from '../../solicitud/entities/solicitud.entity';
import { Sesion } from '../../sesion/entities/sesion.entity';
import { Calificacion } from '../../calificacion/entities/calificacion.entity';

@Entity('tutor')
export class Tutor {
    @ApiProperty({ description: 'ID del tutor (clave foránea a usuario)', example: 2 })
    @PrimaryColumn()
    id: number;

    @ApiProperty({ description: 'Cédula del tutor', example: 'V-87654321' })
    @Column({ length: 20, unique: true })
    cedula: string;

    @ApiProperty({ description: 'Profesión del tutor', example: 'Ingeniero de Sistemas' })
    @Column({ length: 100, nullable: true })
    profesion: string;

    @ApiProperty({ description: 'Experiencia del tutor', example: '2 años de experiencia en tutorías de matemáticas.' })
    @Column({ type: 'text', nullable: true })
    experiencia: string;

    @ApiProperty({ description: 'Número de teléfono del tutor', example: '0414-7654321' })
    @Column({ length: 20, nullable: true })
    telefono: string;

    @ApiProperty({ description: 'ID de la materia asignada al tutor', example: 1 })
    @Column({ nullable: true })
    materia_id: number; // Columna para la FK

    @OneToOne(() => Usuario, usuario => usuario.tutor, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id' })
    usuario: Usuario;

    @ManyToOne(() => Materia, materia => materia.tutores, { nullable: true })
    @JoinColumn({ name: 'materia_id' })
    materia: Materia;

    @OneToMany(() => Solicitud, solicitud => solicitud.tutor)
    solicitudesAsignadas: Solicitud[];

    @OneToMany(() => Sesion, sesion => sesion.tutor)
    sesionesComoTutor: Sesion[];

    @OneToMany(() => Calificacion, calificacion => calificacion.tutor)
    calificaciones: Calificacion[];
}