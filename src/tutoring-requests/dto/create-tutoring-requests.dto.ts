import { IsString, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTutoringRequestsDto {
    @ApiProperty({ description: 'Nombre del objeto', example: 'Nuevo Objeto', required: true })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Descripción del objeto', example: 'Una descripción detallada.', required: true })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Cantidad del objeto', example: 50, required: true })
    @IsInt()
    @IsNotEmpty()
    quantity: number;
}