import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateSesionDto {
    @ApiProperty({ description: 'ID de la solicitud de la que se deriva esta sesión', example: 1, required: true })
    @IsInt()
    @IsNotEmpty()
    solicitud_id: number;

    @ApiProperty({ description: 'ID del tutor que impartirá la sesión', example: 2, required: true })
    @IsInt()
    @IsNotEmpty()
    tutor_id: number;

    @ApiProperty({ description: 'ID del estudiante que recibirá la sesión', example: 1, required: true })
    @IsInt()
    @IsNotEmpty()
    estudiante_id: number;

    @ApiProperty({ description: 'ID de la materia de la sesión', example: 1, required: true })
    @IsInt()
    @IsNotEmpty()
    materia_id: number;

    @ApiProperty({ description: 'Fecha de la sesión (YYYY-MM-DD)', example: '2025-07-15', required: true })
    @IsDateString()
    @IsNotEmpty()
    fecha: string;

    @ApiProperty({ description: 'Hora de la sesión (HH:MM:SS)', example: '10:00:00', required: true })
    @IsString()
    @IsNotEmpty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'La hora debe estar en formato HH:MM:SS' })
    hora: string;
}