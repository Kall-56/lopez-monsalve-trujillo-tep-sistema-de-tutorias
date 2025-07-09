import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'; // Importa para Swagger
import { TutoringRequestsService } from "./tutoring-requests.service";
import { CreateTutoringRequestsDto } from "./dto/create-tutoring-requests.dto";
import { TutoringRequests } from "./entities/tutoring-requests.entity";

@ApiTags('Tutoring Requests')
@Controller('tutoring-requests')
export class TutoringRequestsController {
  constructor(private readonly service: TutoringRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo objeto' }) // Descripción de la operación
  @ApiResponse({ status: 201, description: 'El objeto ha sido creado exitosamente.', type: TutoringRequests }) // Respuesta exitosa
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' }) // Error de validación
  async create(@Body() CreateTutoringRequestsDto: CreateTutoringRequestsDto): Promise<TutoringRequests> {
    return this.service.create(CreateTutoringRequestsDto);
  }
}
