import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Solicitud } from '../../solicitud/entities/solicitud.entity';
import { Sesion } from '../../sesion/entities/sesion.entity';
import { Tutor } from '../../tutor/entities/tutor.entity';

@Entity('materia')
export class Materia {
    @ApiProperty({ description: 'Identificador único de la materia', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Nombre de la materia', example: 'Cálculo I' })
    @Column({ length: 100 })
    nombre: string;

    @ApiProperty({ description: 'Código de la materia (único)', example: 'CI001' })
    @Column({ length: 20, unique: true })
    codigo: string;

    @OneToMany(() => Solicitud, solicitud => solicitud.materia)
    solicitudes: Solicitud[];

    @OneToMany(() => Sesion, sesion => sesion.materia)
    sesiones: Sesion[];

    @OneToMany(() => Tutor, tutor => tutor.materia)
    tutores: Tutor[];
}