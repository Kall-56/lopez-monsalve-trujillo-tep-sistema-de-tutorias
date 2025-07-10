import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Tutor } from '../../tutor/entities/tutor.entity';
import { Coordinador } from '../../coordinador/entities/coordinador.entity';
import { Log } from '../../log/entities/log.entity';

@Entity('usuario')
export class Usuario {
    @ApiProperty({ description: 'Identificador único del usuario', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Nombre completo del usuario', example: 'Juan Pérez' })
    @Column({ length: 100 })
    nombre: string;

    @ApiProperty({ description: 'Correo electrónico del usuario (único)', example: 'juan.perez@example.com' })
    @Column({ length: 100, unique: true })
    correo: string;

    @ApiProperty({ description: 'Contraseña del usuario (hash)', example: 'hashedpassword123' })
    @Column({ length: 255 })
    contraseña: string;

    @ApiProperty({ description: 'Estado de actividad del usuario', example: true })
    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @ApiProperty({ description: 'Fecha de creación del usuario', example: '2025-07-09T10:00:00.000Z' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion: Date;

    @OneToOne(() => Estudiante, estudiante => estudiante.usuario)
    estudiante: Estudiante;

    @OneToOne(() => Tutor, tutor => tutor.usuario)
    tutor: Tutor;

    @OneToOne(() => Coordinador, coordinador => coordinador.usuario)
    coordinador: Coordinador;

    @OneToMany(() => Log, log => log.usuario)
    logs: Log[];
}