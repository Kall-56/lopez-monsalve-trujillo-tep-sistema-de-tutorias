import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const user = await this.usuarioRepository.findOne({
      where: { id: payload.sub },
      relations: ['estudiante', 'tutor', 'coordinador'],
    });

    if (!user || !user.activo) {
      throw new UnauthorizedException('Usuario no válido o inactivo');
    }

    // Determinar el rol del usuario
    let rol = 'usuario';
    if (user.estudiante) rol = 'estudiante';
    else if (user.tutor) rol = 'tutor';
    else if (user.coordinador) rol = 'coordinador';

    return {
      id: user.id,
      correo: user.correo,
      nombre: user.nombre,
      rol,
    };
  }
} 