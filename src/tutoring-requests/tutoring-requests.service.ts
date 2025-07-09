import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TutoringRequests } from "./entities/tutoring-requests.entity";
import { CreateTutoringRequestsDto } from "./dto/create-tutoring-requests.dto";

@Injectable()
export class TutoringRequestsService {
    constructor(
        @InjectRepository(TutoringRequests)
        private TutoringRequestRepository: Repository<TutoringRequests>,
    ) {}

    async create(CreateTutoringRequestDto: CreateTutoringRequestsDto): Promise<TutoringRequests> {
        const newEntity = this.TutoringRequestRepository.create(CreateTutoringRequestDto);
        return this.TutoringRequestRepository.save(newEntity);
    }
}
