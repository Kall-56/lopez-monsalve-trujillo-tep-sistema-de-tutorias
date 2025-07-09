import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sesion')
@Unique(['solicitud_id'])
export class Session {
  @ApiProperty({ description: 'ID de la sesión', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID de la solicitud asociada', example: 10 })
  @Column({ name: 'solicitud_id' })
  solicitud_id: number;

  @ApiProperty({ description: 'ID del tutor', example: 5 })
  @Column({ name: 'tutor_id' })
  tutor_id: number;

  @ApiProperty({ description: 'ID del estudiante', example: 7 })
  @Column({ name: 'estudiante_id' })
  estudiante_id: number;

  @ApiProperty({ description: 'ID de la materia', example: 3 })
  @Column({ name: 'materia_id' })
  materia_id: number;

  @ApiProperty({ description: 'Fecha de la sesión', example: '2024-06-01' })
  @Column({ type: 'date' })
  fecha: string;

  @ApiProperty({ description: 'Hora de la sesión', example: '14:00:00' })
  @Column({ type: 'time' })
  hora: string;

  @ApiProperty({ description: '¿La sesión fue completada?', example: false })
  @Column({ default: false })
  completada: boolean;
} 