import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TutoringRequests } from "./entities/tutoring-requests.entity";
import { CreateTutoringRequestsDto } from "./dto/create-tutoring-requests.dto";
import { UpdateTutoringRequestsDto } from "./dto/update-tutoring-requests.dto";

@Injectable()
export class TutoringRequestsService {
    constructor(
        @InjectRepository(TutoringRequests)
        private TutoringRequestRepository: Repository<TutoringRequests>,
    ) {}

    async create(createTutoringRequestDto: CreateTutoringRequestsDto): Promise<TutoringRequests> {
        const newEntity = this.TutoringRequestRepository.create({
            ...createTutoringRequestDto,
            requestedDate: new Date(createTutoringRequestDto.requestedDate),
        });
        return this.TutoringRequestRepository.save(newEntity);
    }

    async findAll(): Promise<TutoringRequests[]> {
        return this.TutoringRequestRepository.find({
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: number): Promise<TutoringRequests> {
        const tutoringRequest = await this.TutoringRequestRepository.findOne({ where: { id } });
        if (!tutoringRequest) {
            throw new NotFoundException(`Tutoring request with ID ${id} not found`);
        }
        return tutoringRequest;
    }

    async update(id: number, updateDto: UpdateTutoringRequestsDto): Promise<TutoringRequests> {
        const tutoringRequest = await this.findOne(id);
        
        // Convertir la fecha si está presente
        if (updateDto.requestedDate) {
            updateDto.requestedDate = new Date(updateDto.requestedDate).toISOString();
        }
        
        Object.assign(tutoringRequest, updateDto);
        return this.TutoringRequestRepository.save(tutoringRequest);
    }

    async remove(id: number): Promise<void> {
        const tutoringRequest = await this.findOne(id);
        await this.TutoringRequestRepository.remove(tutoringRequest);
    }
}
