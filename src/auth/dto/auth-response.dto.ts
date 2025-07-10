import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticación',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
  })
  user: {
    id: number;
    nombre: string;
    correo: string;
    rol: string;
  };

  @ApiProperty({
    description: 'Mensaje de éxito',
    example: 'Login exitoso',
  })
  message: string;
} 