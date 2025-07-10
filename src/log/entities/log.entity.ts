import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('log')
export class Log {
    @ApiProperty({ description: 'Identificador único del registro de log', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'ID del usuario asociado a la acción', example: 1 })
    @Column()
    usuario_id: number;

    @ApiProperty({ description: 'Descripción de la acción realizada', example: 'Creación de solicitud' })
    @Column({ length: 255 })
    accion: string;

    @ApiProperty({ description: 'Fecha y hora del registro del log', example: '2025-07-09T10:00:00.000Z' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;

    @ApiProperty({ description: 'Detalles adicionales de la acción (JSON)', example: { solicitudId: 10, materia: 'Matemáticas' }, nullable: true })
    @Column({ type: 'jsonb', nullable: true })
    detalles: object; // Usamos 'jsonb' para PostgreSQL para almacenar objetos JSON

    @ManyToOne(() => Usuario, usuario => usuario.logs)
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;
}