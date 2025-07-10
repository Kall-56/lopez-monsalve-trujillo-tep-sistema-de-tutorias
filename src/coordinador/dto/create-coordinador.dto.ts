import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCoordinadorDto {
    @ApiProperty({ description: 'ID del usuario asociado a este coordinador', example: 3, required: true })
    @IsInt()
    @IsNotEmpty()
    id: number; // El ID del usuario que será coordinador

    @ApiProperty({ description: 'Cédula del coordinador', example: 'V-98765432', required: true })
    @IsString()
    @IsNotEmpty()
    cedula: string;

    @ApiProperty({ description: 'Departamento al que pertenece el coordinador', example: 'Ciencias Básicas', required: false, nullable: true })
    @IsString()
    @IsOptional()
    departamento?: string;

    @ApiProperty({ description: 'Extensión interna del teléfono del coordinador', example: '1234', required: false, nullable: true })
    @IsString()
    @IsOptional()
    extension_interna?: string;
}