import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './usuario/entities/usuario.entity';
import { Estudiante } from './estudiante/entities/estudiante.entity';
import { Tutor } from './tutor/entities/tutor.entity';
import { Coordinador } from './coordinador/entities/coordinador.entity';
import { Materia } from './materia/entities/materia.entity';
import { CreateUsuarioDto } from './usuario/dto/create-usuario.dto';
import { UpdateUsuarioDto } from './usuario/dto/update-usuario.dto';
import { CreateEstudianteDto } from './estudiante/dto/create-estudiante.dto';
import { CreateTutorDto } from './tutor/dto/create-tutor.dto';
import { CreateCoordinadorDto } from './coordinador/dto/create-coordinador.dto';

// Importar los DTOs del controlador
import { RegistroEstudianteDto, RegistroTutorDto, RegistroCoordinadorDto, AsignarTutorMateriaDto } from './app.controller';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Tutor)
    private tutorRepository: Repository<Tutor>,
    @InjectRepository(Coordinador)
    private coordinadorRepository: Repository<Coordinador>,
    @InjectRepository(Materia)
    private materiaRepository: Repository<Materia>,
  ) {}

  getHello(): string {
    return 'Sistema de Tutorías Académicas - API REST';
  }

  /**
   * Registra un nuevo estudiante
   */
  async registrarEstudiante(registroDto: RegistroEstudianteDto): Promise<Estudiante> {
    // Verificar si el correo ya existe
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { correo: registroDto.correo }
    });

    if (usuarioExistente) {
      throw new HttpException(
        'El correo electrónico ya está registrado',
        HttpStatus.CONFLICT
      );
    }

    // Verificar si la cédula del estudiante ya existe
    const estudianteExistente = await this.estudianteRepository.findOne({
      where: { cedula: registroDto.cedula }
    });

    if (estudianteExistente) {
      throw new HttpException(
        'La cédula del estudiante ya está registrada',
        HttpStatus.CONFLICT
      );
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const contraseñaEncriptada = await bcrypt.hash(registroDto.contraseña, saltRounds);

    // Crear el usuario
    const nuevoUsuario = this.usuarioRepository.create({
      nombre: registroDto.nombre,
      correo: registroDto.correo,
      contraseña: contraseñaEncriptada,
      activo: true,
      fecha_creacion: new Date()
    });

    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

    // Crear el estudiante
    const nuevoEstudiante = this.estudianteRepository.create({
      id: usuarioGuardado.id,
      cedula: registroDto.cedula,
      carrera: registroDto.carrera,
      semestre: registroDto.semestre,
      telefono: registroDto.telefono
    });

    const estudianteGuardado = await this.estudianteRepository.save(nuevoEstudiante);

    // Retornar el estudiante con la relación del usuario
    const estudianteCompleto = await this.estudianteRepository.findOne({
      where: { id: estudianteGuardado.id },
      relations: ['usuario']
    });

    if (!estudianteCompleto) {
      throw new HttpException(
        'Error al recuperar el estudiante creado',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return estudianteCompleto;
  }

  /**
   * Registra un nuevo tutor
   */
  async registrarTutor(registroDto: RegistroTutorDto): Promise<Tutor> {
    // Verificar si el correo ya existe
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { correo: registroDto.correo }
    });

    if (usuarioExistente) {
      throw new HttpException(
        'El correo electrónico ya está registrado',
        HttpStatus.CONFLICT
      );
    }

    // Verificar si la cédula del tutor ya existe
    const tutorExistente = await this.tutorRepository.findOne({
      where: { cedula: registroDto.cedula }
    });

    if (tutorExistente) {
      throw new HttpException(
        'La cédula del tutor ya está registrada',
        HttpStatus.CONFLICT
      );
    }

    // Verificar si la materia existe (si se proporciona)
    if (registroDto.materia_id) {
      const materia = await this.materiaRepository.findOne({
        where: { id: registroDto.materia_id }
      });

      if (!materia) {
        throw new HttpException(
          'La materia especificada no existe',
          HttpStatus.BAD_REQUEST
        );
      }
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const contraseñaEncriptada = await bcrypt.hash(registroDto.contraseña, saltRounds);

    // Crear el usuario
    const nuevoUsuario = this.usuarioRepository.create({
      nombre: registroDto.nombre,
      correo: registroDto.correo,
      contraseña: contraseñaEncriptada,
      activo: true,
      fecha_creacion: new Date()
    });

    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

    // Crear el tutor
    const nuevoTutor = this.tutorRepository.create({
      id: usuarioGuardado.id,
      cedula: registroDto.cedula,
      profesion: registroDto.profesion,
      experiencia: registroDto.experiencia,
      telefono: registroDto.telefono,
      materia_id: registroDto.materia_id
    });

    const tutorGuardado = await this.tutorRepository.save(nuevoTutor);

    // Retornar el tutor con las relaciones
    const tutorCompleto = await this.tutorRepository.findOne({
      where: { id: tutorGuardado.id },
      relations: ['usuario', 'materia']
    });

    if (!tutorCompleto) {
      throw new HttpException(
        'Error al recuperar el tutor creado',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return tutorCompleto;
  }

  /**
   * Registra un nuevo coordinador
   */
  async registrarCoordinador(registroDto: RegistroCoordinadorDto): Promise<Coordinador> {
    // Verificar si el correo ya existe
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { correo: registroDto.correo }
    });

    if (usuarioExistente) {
      throw new HttpException(
        'El correo electrónico ya está registrado',
        HttpStatus.CONFLICT
      );
    }

    // Verificar si la cédula del coordinador ya existe
    const coordinadorExistente = await this.coordinadorRepository.findOne({
      where: { cedula: registroDto.cedula }
    });

    if (coordinadorExistente) {
      throw new HttpException(
        'La cédula del coordinador ya está registrada',
        HttpStatus.CONFLICT
      );
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const contraseñaEncriptada = await bcrypt.hash(registroDto.contraseña, saltRounds);

    // Crear el usuario
    const nuevoUsuario = this.usuarioRepository.create({
      nombre: registroDto.nombre,
      correo: registroDto.correo,
      contraseña: contraseñaEncriptada,
      activo: true,
      fecha_creacion: new Date()
    });

    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

    // Crear el coordinador
    const nuevoCoordinador = this.coordinadorRepository.create({
      id: usuarioGuardado.id,
      cedula: registroDto.cedula,
      departamento: registroDto.departamento,
      extension_interna: registroDto.extension_interna
    });

    const coordinadorGuardado = await this.coordinadorRepository.save(nuevoCoordinador);

    // Retornar el coordinador con la relación del usuario
    const coordinadorCompleto = await this.coordinadorRepository.findOne({
      where: { id: coordinadorGuardado.id },
      relations: ['usuario']
    });

    if (!coordinadorCompleto) {
      throw new HttpException(
        'Error al recuperar el coordinador creado',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return coordinadorCompleto;
  }

  /**
   * Obtiene el perfil de un usuario por ID
   */
  async obtenerPerfil(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['estudiante', 'tutor', 'coordinador']
    });

    if (!usuario) {
      throw new HttpException(
        'Usuario no encontrado',
        HttpStatus.NOT_FOUND
      );
    }

    return usuario;
  }

  /**
   * Actualiza el perfil de un usuario
   */
  async actualizarPerfil(id: number, updateDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id }
    });

    if (!usuario) {
      throw new HttpException(
        'Usuario no encontrado',
        HttpStatus.NOT_FOUND
      );
    }

    // Verificar si el nuevo correo ya existe (si se está actualizando)
    if (updateDto.correo && updateDto.correo !== usuario.correo) {
      const usuarioConCorreo = await this.usuarioRepository.findOne({
        where: { correo: updateDto.correo }
      });

      if (usuarioConCorreo) {
        throw new HttpException(
          'El correo electrónico ya está en uso',
          HttpStatus.CONFLICT
        );
      }
    }

    // Encriptar nueva contraseña si se proporciona
    if (updateDto.contraseña) {
      const saltRounds = 10;
      updateDto.contraseña = await bcrypt.hash(updateDto.contraseña, saltRounds);
    }

    // Actualizar el usuario
    await this.usuarioRepository.update(id, updateDto);

    // Retornar el usuario actualizado
    return this.obtenerPerfil(id);
  }

  /**
   * Asigna un tutor a una materia (solo coordinadores)
   */
  async asignarTutorMateria(asignacionDto: AsignarTutorMateriaDto): Promise<Tutor> {
    const { tutorId, materiaId } = asignacionDto;

    // Verificar que el tutor existe
    const tutor = await this.tutorRepository.findOne({
      where: { id: tutorId },
      relations: ['usuario', 'materia']
    });

    if (!tutor) {
      throw new HttpException(
        'Tutor no encontrado',
        HttpStatus.NOT_FOUND
      );
    }

    // Verificar que la materia existe
    const materia = await this.materiaRepository.findOne({
      where: { id: materiaId }
    });

    if (!materia) {
      throw new HttpException(
        'Materia no encontrada',
        HttpStatus.NOT_FOUND
      );
    }

    // Verificar que el usuario es un coordinador (aquí deberías implementar la lógica de autenticación)
    // Por ahora, asumimos que cualquier usuario puede hacer esta operación
    // En un sistema real, deberías verificar el rol del usuario autenticado

    // Asignar la materia al tutor
    tutor.materia_id = materiaId;
    await this.tutorRepository.save(tutor);

    // Retornar el tutor actualizado
    const tutorActualizado = await this.tutorRepository.findOne({
      where: { id: tutorId },
      relations: ['usuario', 'materia']
    });

    if (!tutorActualizado) {
      throw new HttpException(
        'Error al recuperar el tutor actualizado',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return tutorActualizado;
  }

  /**
   * Obtiene la lista de tutores
   */
  async obtenerTutores(materiaId?: number): Promise<Tutor[]> {
    const query = this.tutorRepository.createQueryBuilder('tutor')
      .leftJoinAndSelect('tutor.usuario', 'usuario')
      .leftJoinAndSelect('tutor.materia', 'materia');

    if (materiaId) {
      query.where('tutor.materia_id = :materiaId', { materiaId });
    }

    return query.getMany();
  }

  /**
   * Obtiene la lista de estudiantes
   */
  async obtenerEstudiantes(): Promise<Estudiante[]> {
    return this.estudianteRepository.find({
      relations: ['usuario']
    });
  }

  /**
   * Obtiene la lista de coordinadores
   */
  async obtenerCoordinadores(): Promise<Coordinador[]> {
    return this.coordinadorRepository.find({
      relations: ['usuario']
    });
  }

  /**
   * Obtiene la lista de materias
   */
  async obtenerMaterias(): Promise<Materia[]> {
    return this.materiaRepository.find({
      relations: ['tutores']
    });
  }
}
