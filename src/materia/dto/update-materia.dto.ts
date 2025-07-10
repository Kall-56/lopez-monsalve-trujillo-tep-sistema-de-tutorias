import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateMateriaDto } from './create-materia.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateMateriaDto extends PartialType(CreateMateriaDto) {
    @ApiProperty({ description: 'Nuevo nombre de la materia', example: 'Cálculo Diferencial', required: false })
    @IsString()
    @IsOptional()
    nombre?: string;

    @ApiProperty({ description: 'Nuevo código único de la materia', example: 'MAT201', required: false })
    @IsString()
    @IsOptional()
    @MinLength(3, { message: 'El código de la materia debe tener al menos 3 caracteres' })
    codigo?: string;
}