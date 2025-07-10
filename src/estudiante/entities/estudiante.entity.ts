import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Solicitud } from '../../solicitud/entities/solicitud.entity';
import { Sesion } from '../../sesion/entities/sesion.entity';
import { Calificacion } from '../../calificacion/entities/calificacion.entity';

@Entity('estudiante')
export class Estudiante {
    @ApiProperty({ description: 'ID del estudiante (clave foránea a usuario)', example: 1 })
    @PrimaryColumn()
    id: number;

    @ApiProperty({ description: 'Cédula del estudiante', example: 'V-12345678' })
    @Column({ length: 20, unique: true })
    cedula: string;

    @ApiProperty({ description: 'Carrera del estudiante', example: 'Ingeniería Informática' })
    @Column({ length: 100, nullable: true })
    carrera: string;

    @ApiProperty({ description: 'Semestre actual del estudiante', example: 5 })
    @Column({ type: 'integer', nullable: true })
    semestre: number;

    @ApiProperty({ description: 'Número de teléfono del estudiante', example: '0412-1234567' })
    @Column({ length: 20, nullable: true })
    telefono: string;

    @OneToOne(() => Usuario, usuario => usuario.estudiante, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id' })
    usuario: Usuario;

    @OneToMany(() => Solicitud, solicitud => solicitud.estudiante)
    solicitudes: Solicitud[];

    @OneToMany(() => Sesion, sesion => sesion.estudiante)
    sesiones: Sesion[];

    @OneToMany(() => Calificacion, calificacion => calificacion.estudiante)
    calificaciones: Calificacion[];
}