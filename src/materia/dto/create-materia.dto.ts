import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateMateriaDto {
    @ApiProperty({ description: 'Nombre de la materia', example: 'Cálculo I', required: true })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ description: 'Código único de la materia', example: 'MAT101', required: true })
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'El código de la materia debe tener al menos 3 caracteres' })
    codigo: string;
}