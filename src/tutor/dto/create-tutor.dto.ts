import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTutorDto {
    @ApiProperty({ description: 'ID del usuario asociado a este tutor', example: 2, required: true })
    @IsInt()
    @IsNotEmpty()
    id: number; // El ID del usuario que será tutor

    @ApiProperty({ description: 'Cédula del tutor', example: 'V-23456789', required: true })
    @IsString()
    @IsNotEmpty()
    cedula: string;

    @ApiProperty({ description: 'Profesión del tutor', example: 'Ingeniero de Software', required: false, nullable: true })
    @IsString()
    @IsOptional()
    profesion?: string;

    @ApiProperty({ description: 'Experiencia relevante del tutor', example: '5 años dando clases de cálculo.', required: false, nullable: true })
    @IsString()
    @IsOptional()
    experiencia?: string;

    @ApiProperty({ description: 'Número de teléfono del tutor', example: '0424-9876543', required: false, nullable: true })
    @IsString()
    @IsOptional()
    telefono?: string;

    @ApiProperty({ description: 'ID de la materia principal que imparte el tutor', example: 1, required: false, nullable: true })
    @IsInt()
    @IsOptional()
    materia_id?: number; // Clave foránea a materia
}