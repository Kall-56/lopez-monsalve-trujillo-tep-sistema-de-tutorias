import { PartialType } from '@nestjs/swagger';
import { CreateCoordinadorDto } from './create-coordinador.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCoordinadorDto extends PartialType(CreateCoordinadorDto) {
    @ApiProperty({ description: 'Nueva cédula del coordinador', example: 'V-12345678', required: false })
    @IsString()
    @IsOptional()
    cedula?: string; // No es obligatorio que se cambie el ID en un update
}