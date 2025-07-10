import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateLogDto {
    @ApiProperty({ description: 'ID del usuario que realizó la acción', example: 1, required: true })
    @IsInt()
    @IsNotEmpty()
    usuario_id: number;

    @ApiProperty({ description: 'Descripción de la acción realizada', example: 'Solicitud creada', required: true })
    @IsString()
    @IsNotEmpty()
    accion: string;

    @ApiProperty({ description: 'Detalles adicionales de la acción en formato JSON', example: { solicitudId: 5, status: 'PENDIENTE' }, required: false, nullable: true })
    @IsObject()
    @IsOptional()
    detalles?: object;
}