import { PartialType } from '@nestjs/swagger';
import { CreateSolicitudDto } from './create-solicitud.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsEnum } from 'class-validator';
import { EstadoSolicitud } from '../entities/solicitud.entity';

export class UpdateSolicitudDto extends PartialType(CreateSolicitudDto) {
    @ApiProperty({ description: 'Nuevo ID del tutor asignado', example: 3, required: false })
    @IsInt()
    @IsOptional()
    tutor_id?: number;

    @ApiProperty({
        description: 'Nuevo estado de la solicitud',
        enum: EstadoSolicitud,
        example: EstadoSolicitud.ACEPTADA,
        required: false,
    })
    @IsEnum(EstadoSolicitud)
    @IsOptional()
    estado?: EstadoSolicitud;
}