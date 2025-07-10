import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    @ApiProperty({ description: 'Nuevo nombre completo del usuario', example: 'Juan Carlos Pérez', required: false })
    @IsString()
    @IsOptional()
    nombre?: string;

    @ApiProperty({ description: 'Nuevo correo electrónico único del usuario', example: 'juan.carlos.p@example.com', required: false })
    @IsString() // @IsEmail se hereda de CreateUsuarioDto si no se redefine
    @IsOptional()
    correo?: string;

    @ApiProperty({ description: 'Nueva contraseña del usuario', example: 'NuevaContraseña456', required: false })
    @IsString()
    @IsOptional()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    contraseña?: string;

    @ApiProperty({ description: 'Estado de activación del usuario', example: false, required: false })
    @IsBoolean()
    @IsOptional()
    activo?: boolean;
}