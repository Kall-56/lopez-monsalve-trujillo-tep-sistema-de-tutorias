import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString, Matches, IsEnum } from 'class-validator';
import { EstadoSolicitud } from '../entities/solicitud.entity'; // Importa el enum

export class CreateSolicitudDto {
    @ApiProperty({ description: 'ID del estudiante que realiza la solicitud', example: 1, required: true })
    @IsInt()
    @IsNotEmpty()
    estudiante_id: number;

    @ApiProperty({ description: 'ID de la materia solicitada', example: 1, required: true })
    @IsInt()
    @IsNotEmpty()
    materia_id: number;

    @ApiProperty({ description: 'Fecha deseada para la tutoría (YYYY-MM-DD)', example: '2025-07-15', required: true })
    @IsDateString()
    @IsNotEmpty()
    fecha_solicitada: string; // Usar string para la validación y luego convertir a Date si es necesario

    @ApiProperty({ description: 'Hora deseada para la tutoría (HH:MM:SS)', example: '10:00:00', required: true })
    @IsString()
    @IsNotEmpty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'La hora solicitada debe estar en formato HH:MM:SS' })
    hora_solicitada: string;

    // El estado inicial siempre será PENDIENTE al crear una solicitud
    @ApiProperty({
        description: 'Estado de la solicitud (automáticamente PENDIENTE al crear)',
        enum: EstadoSolicitud,
        example: EstadoSolicitud.PENDIENTE,
        readOnly: true, // Indica que este campo no debe ser enviado por el cliente en la creación
    })
    estado: EstadoSolicitud = EstadoSolicitud.PENDIENTE; // Valor por defecto

    @ApiProperty({ description: 'ID del tutor asignado (opcional, asignado por coordinador o tutor)', example: 2, nullable: true, required: false })
    @IsInt()
        // @IsOptional() // Si un coordinador puede asignarlo en la creación
    tutor_id?: number;
}