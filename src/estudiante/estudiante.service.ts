import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
    try {
      // Crear primero el usuario
      const usuario = this.usuarioRepository.create({
        nombre: createEstudianteDto.nombre,
        correo: createEstudianteDto.correo,
        contraseña: createEstudianteDto.contraseña,
        activo: true,
      });

      const savedUsuario = await this.usuarioRepository.save(usuario);

      // Crear el estudiante
      const estudiante = this.estudianteRepository.create({
        id: savedUsuario.id,
        cedula: createEstudianteDto.cedula,
        carrera: createEstudianteDto.carrera,
        semestre: createEstudianteDto.semestre,
        telefono: createEstudianteDto.telefono,
      });

      return await this.estudianteRepository.save(estudiante);
    } catch (error) {
      if (error.code === '23505') { // Código de error de PostgreSQL para unique constraint
        throw new BadRequestException('El correo o cédula ya existe');
      }
      throw new BadRequestException('Error al crear el estudiante');
    }
  }

  async findAll(): Promise<Estudiante[]> {
    return await this.estudianteRepository.find({
      relations: ['usuario'],
    });
  }

  async findOne(id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }

    return estudiante;
  }

  async update(id: number, updateEstudianteDto: UpdateEstudianteDto): Promise<Estudiante> {
    const estudiante = await this.findOne(id);

    // Actualizar datos del usuario si se proporcionan
    if (updateEstudianteDto.nombre || updateEstudianteDto.correo) {
      const usuario = await this.usuarioRepository.findOne({ where: { id } });
      if (usuario) {
        if (updateEstudianteDto.nombre) usuario.nombre = updateEstudianteDto.nombre;
        if (updateEstudianteDto.correo) usuario.correo = updateEstudianteDto.correo;
        await this.usuarioRepository.save(usuario);
      }
    }

    // Actualizar datos del estudiante
    Object.assign(estudiante, updateEstudianteDto);
    return await this.estudianteRepository.save(estudiante);
  }

  async remove(id: number): Promise<void> {
    const estudiante = await this.findOne(id);
    
    // Desactivar el usuario en lugar de eliminarlo
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (usuario) {
      usuario.activo = false;
      await this.usuarioRepository.save(usuario);
    }

    // Eliminar el estudiante
    await this.estudianteRepository.remove(estudiante);
  }
} 