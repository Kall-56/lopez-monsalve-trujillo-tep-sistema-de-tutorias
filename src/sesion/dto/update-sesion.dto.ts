import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateSesionDto } from './create-sesion.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSesionDto extends PartialType(CreateSesionDto) {
    @ApiProperty({ description: 'Indica si la sesión ha sido completada', example: true, required: false })
    @IsBoolean()
    @IsOptional()
    completada?: boolean;
}