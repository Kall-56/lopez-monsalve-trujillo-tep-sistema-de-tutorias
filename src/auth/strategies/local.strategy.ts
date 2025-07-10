import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'correo',
    });
  }

  async validate(correo: string, contraseña: string): Promise<any> {
    const user = await this.authService.validateUser(correo, contraseña);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }
} 