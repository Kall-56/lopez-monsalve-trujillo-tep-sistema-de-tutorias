import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

@Entity('your_table_name') // Nombre de tu tabla en PostgreSQL
export class TutoringRequests {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Nombre del objeto', example: 'Mi Objeto' })
    @Column()
    name: string;

    @ApiProperty({ description: 'Descripción del objeto', example: 'Esto es una descripción.' })
    @Column()
    description: string;

    @ApiProperty({ description: 'Cantidad del objeto', example: 100 })
    @Column()
    quantity: number;
}