import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materia } from './entities/materia.entity';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';

@Injectable()
export class MateriaService {
    constructor(
        @InjectRepository(Materia)
        private readonly materiaRepository: Repository<Materia>,
    ) {}

    /**
     * Crear una nueva materia
     */
    async create(createMateriaDto: CreateMateriaDto): Promise<Materia> {
        // Verificar que no existe una materia con el mismo código
        const materiaExistente = await this.materiaRepository.findOne({
            where: { codigo: createMateriaDto.codigo }
        });

        if (materiaExistente) {
            throw new ConflictException('Ya existe una materia con este código');
        }

        // Verificar que no existe una materia con el mismo nombre
        const materiaConMismoNombre = await this.materiaRepository.findOne({
            where: { nombre: createMateriaDto.nombre }
        });

        if (materiaConMismoNombre) {
            throw new ConflictException('Ya existe una materia con este nombre');
        }

        const materia = this.materiaRepository.create(createMateriaDto);
        return await this.materiaRepository.save(materia);
    }

    /**
     * Obtener todas las materias
     */
    async findAll(): Promise<Materia[]> {
        return await this.materiaRepository.find({
            order: { nombre: 'ASC' }
        });
    }

    /**
     * Obtener una materia por ID
     */
    async findOne(id: number): Promise<Materia> {
        const materia = await this.materiaRepository.findOne({
            where: { id }
        });

        if (!materia) {
            throw new NotFoundException(`Materia con ID ${id} no encontrada`);
        }

        return materia;
    }

    /**
     * Obtener una materia por código
     */
    async findByCodigo(codigo: string): Promise<Materia> {
        const materia = await this.materiaRepository.findOne({
            where: { codigo }
        });

        if (!materia) {
            throw new NotFoundException(`Materia con código ${codigo} no encontrada`);
        }

        return materia;
    }

    /**
     * Buscar materias por nombre (búsqueda parcial)
     */
    async findByNombre(nombre: string): Promise<Materia[]> {
        return await this.materiaRepository
            .createQueryBuilder('materia')
            .where('materia.nombre ILIKE :nombre', { nombre: `%${nombre}%` })
            .orderBy('materia.nombre', 'ASC')
            .getMany();
    }

    /**
     * Actualizar una materia
     */
    async update(id: number, updateMateriaDto: UpdateMateriaDto): Promise<Materia> {
        const materia = await this.findOne(id);

        // Si se está actualizando el código, verificar que no exista otro con el mismo código
        if (updateMateriaDto.codigo && updateMateriaDto.codigo !== materia.codigo) {
            const materiaConMismoCodigo = await this.materiaRepository.findOne({
                where: { codigo: updateMateriaDto.codigo }
            });

            if (materiaConMismoCodigo) {
                throw new ConflictException('Ya existe una materia con este código');
            }
        }

        // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
        if (updateMateriaDto.nombre && updateMateriaDto.nombre !== materia.nombre) {
            const materiaConMismoNombre = await this.materiaRepository.findOne({
                where: { nombre: updateMateriaDto.nombre }
            });

            if (materiaConMismoNombre) {
                throw new ConflictException('Ya existe una materia con este nombre');
            }
        }

        Object.assign(materia, updateMateriaDto);
        return await this.materiaRepository.save(materia);
    }

    /**
     * Eliminar una materia
     */
    async remove(id: number): Promise<void> {
        const materia = await this.findOne(id);

        // Verificar que no tenga tutores asignados
        const tutoresAsignados = await this.materiaRepository
            .createQueryBuilder('materia')
            .leftJoin('materia.tutores', 'tutor')
            .where('materia.id = :id', { id })
            .andWhere('tutor.id IS NOT NULL')
            .getCount();

        if (tutoresAsignados > 0) {
            throw new BadRequestException('No se puede eliminar una materia que tiene tutores asignados');
        }

        // Verificar que no tenga solicitudes asociadas
        const solicitudesAsociadas = await this.materiaRepository
            .createQueryBuilder('materia')
            .leftJoin('materia.solicitudes', 'solicitud')
            .where('materia.id = :id', { id })
            .andWhere('solicitud.id IS NOT NULL')
            .getCount();

        if (solicitudesAsociadas > 0) {
            throw new BadRequestException('No se puede eliminar una materia que tiene solicitudes asociadas');
        }

        // Verificar que no tenga sesiones asociadas
        const sesionesAsociadas = await this.materiaRepository
            .createQueryBuilder('materia')
            .leftJoin('materia.sesiones', 'sesion')
            .where('materia.id = :id', { id })
            .andWhere('sesion.id IS NOT NULL')
            .getCount();

        if (sesionesAsociadas > 0) {
            throw new BadRequestException('No se puede eliminar una materia que tiene sesiones asociadas');
        }

        await this.materiaRepository.remove(materia);
    }

    /**
     * Obtener estadísticas de materias
     */
    async getEstadisticas(): Promise<any> {
        const totalMaterias = await this.materiaRepository.count();

        const materiasConTutores = await this.materiaRepository
            .createQueryBuilder('materia')
            .leftJoin('materia.tutores', 'tutor')
            .where('tutor.id IS NOT NULL')
            .getCount();

        const materiasSinTutores = totalMaterias - materiasConTutores;

        const materiasConSolicitudes = await this.materiaRepository
            .createQueryBuilder('materia')
            .leftJoin('materia.solicitudes', 'solicitud')
            .where('solicitud.id IS NOT NULL')
            .getCount();

        return {
            totalMaterias,
            materiasConTutores,
            materiasSinTutores,
            materiasConSolicitudes,
            porcentajeConTutores: totalMaterias > 0 ? Math.round((materiasConTutores / totalMaterias) * 100) : 0
        };
    }
} 