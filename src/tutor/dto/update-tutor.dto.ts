import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateTutorDto } from './create-tutor.dto';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateTutorDto extends PartialType(CreateTutorDto) {
    @ApiProperty({ description: 'Nueva cédula del tutor', example: 'V-98765432', required: false })
    @IsString()
    @IsOptional()
    cedula?: string;

    @ApiProperty({ description: 'Nueva profesión del tutor', example: 'Matemático', required: false })
    @IsString()
    @IsOptional()
    profesion?: string;

    @ApiProperty({ description: 'Nueva experiencia del tutor', example: '10 años en investigación.', required: false })
    @IsString()
    @IsOptional()
    experiencia?: string;

    @ApiProperty({ description: 'Nuevo número de teléfono del tutor', example: '0416-1122334', required: false })
    @IsString()
    @IsOptional()
    telefono?: string;

    @ApiProperty({ description: 'Nuevo ID de la materia principal que imparte el tutor', example: 2, required: false })
    @IsInt()
    @IsOptional()
    materia_id?: number;
}