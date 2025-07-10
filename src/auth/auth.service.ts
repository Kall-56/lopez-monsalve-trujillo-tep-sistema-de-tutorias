import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from '../usuario/entities/usuario.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Coordinador } from '../coordinador/entities/coordinador.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto, UserRole } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Tutor)
    private tutorRepository: Repository<Tutor>,
    @InjectRepository(Coordinador)
    private coordinadorRepository: Repository<Coordinador>,
    private jwtService: JwtService,
  ) {}

  async validateUser(correo: string, contraseña: string): Promise<any> {
    const user = await this.usuarioRepository.findOne({
      where: { correo },
      relations: ['estudiante', 'tutor', 'coordinador'],
    });

    if (user && user.activo && await bcrypt.compare(contraseña, user.contraseña)) {
      // Determinar el rol del usuario
      let rol = 'usuario';
      if (user.estudiante) rol = 'estudiante';
      else if (user.tutor) rol = 'tutor';
      else if (user.coordinador) rol = 'coordinador';

      const { contraseña: _, ...result } = user;
      return { ...result, rol };
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.correo, loginDto.contraseña);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { 
      sub: user.id, 
      correo: user.correo,
      rol: user.rol 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
      message: 'Login exitoso',
    };
  }

  async register(registerDto: RegisterDto) {
    // Verificar si el correo ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: { correo: registerDto.correo },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.contraseña, 10);

    // Crear el usuario
    const usuario = this.usuarioRepository.create({
      nombre: registerDto.nombre,
      correo: registerDto.correo,
      contraseña: hashedPassword,
      activo: true,
    });

    let savedUsuario;
    try {
      savedUsuario = await this.usuarioRepository.save(usuario);

      // Crear la entidad específica según el rol
      let rolEntity;
      switch (registerDto.rol) {
        case UserRole.ESTUDIANTE:
          if (!registerDto.cedula) {
            throw new BadRequestException('Para registrar un estudiante debes enviar cedula');
          }
          rolEntity = this.estudianteRepository.create({
            usuario: savedUsuario,
            cedula: registerDto.cedula,
            carrera: registerDto.carrera,
            semestre: registerDto.semestre,
            telefono: registerDto.telefono,
          });
          await this.estudianteRepository.save(rolEntity);
          break;

        case UserRole.TUTOR:
          if (!registerDto.cedula) {
            throw new BadRequestException('Para registrar un tutor debes enviar cedula');
          }
          rolEntity = this.tutorRepository.create({
            usuario: savedUsuario,
            cedula: registerDto.cedula,
            profesion: registerDto.profesion,
            experiencia: registerDto.experiencia,
            telefono: registerDto.telefono,
          });
          await this.tutorRepository.save(rolEntity);
          break;

        case UserRole.COORDINADOR:
          if (!registerDto.cedula) {
            throw new BadRequestException('Para registrar un coordinador debes enviar cedula');
          }
          rolEntity = this.coordinadorRepository.create({
            usuario: savedUsuario,
            cedula: registerDto.cedula,
            departamento: registerDto.departamento,
            extension_interna: registerDto.extension_interna,
          });
          await this.coordinadorRepository.save(rolEntity);
          break;

        default:
          throw new BadRequestException('Rol no válido');
      }
    } catch (error) {
      // Si ocurre cualquier error, eliminar el usuario creado (rollback manual)
      if (savedUsuario && savedUsuario.id) {
        await this.usuarioRepository.delete(savedUsuario.id);
      }
      throw error;
    }

    // Generar token JWT
    const payload = { 
      sub: savedUsuario.id, 
      correo: savedUsuario.correo,
      rol: registerDto.rol 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedUsuario.id,
        nombre: savedUsuario.nombre,
        correo: savedUsuario.correo,
        rol: registerDto.rol,
      },
      message: 'Usuario registrado exitosamente',
    };
  }

  async getProfile(userId: number) {
    const user = await this.usuarioRepository.findOne({
      where: { id: userId },
      relations: ['estudiante', 'tutor', 'coordinador'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Determinar el rol del usuario
    let rol = 'usuario';
    if (user.estudiante) rol = 'estudiante';
    else if (user.tutor) rol = 'tutor';
    else if (user.coordinador) rol = 'coordinador';

    const { contraseña: _, ...result } = user;
    return { ...result, rol };
  }
} 