import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('coordinador')
export class Coordinador {
    @ApiProperty({ description: 'ID del coordinador (clave foránea a usuario)', example: 3 })
    @PrimaryColumn()
    id: number;

    @ApiProperty({ description: 'Cédula del coordinador', example: 'E-98765432' })
    @Column({ length: 20, unique: true })
    cedula: string;

    @ApiProperty({ description: 'Departamento al que pertenece el coordinador', example: 'Ciencias Básicas' })
    @Column({ length: 100, nullable: true })
    departamento: string;

    @ApiProperty({ description: 'Extensión interna del teléfono del coordinador', example: '1234' })
    @Column({ length: 20, nullable: true })
    extension_interna: string;

    @OneToOne(() => Usuario, usuario => usuario.coordinador, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id' })
    usuario: Usuario;
}