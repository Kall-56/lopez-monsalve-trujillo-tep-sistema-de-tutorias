import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
    @ApiProperty({ description: 'Nombre completo del usuario', example: 'Juan Pérez', required: true })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ description: 'Correo electrónico único del usuario', example: 'juan.perez@example.com', required: true })
    @IsEmail()
    @IsNotEmpty()
    correo: string;

    @ApiProperty({ description: 'Contraseña del usuario', example: 'MiContraseñaSegura123', required: true })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    contraseña: string;

    // Los campos 'activo' y 'fecha_creacion' serán gestionados por el sistema y no se incluyen en el DTO de creación
}