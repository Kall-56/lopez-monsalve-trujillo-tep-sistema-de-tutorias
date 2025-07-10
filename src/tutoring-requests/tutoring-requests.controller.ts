import { Controller, Post, Body, Get, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { TutoringRequestsService } from "./tutoring-requests.service";
import { CreateTutoringRequestsDto } from "./dto/create-tutoring-requests.dto";
import { UpdateTutoringRequestsDto } from "./dto/update-tutoring-requests.dto";
import { TutoringRequests } from "./entities/tutoring-requests.entity";
import { LogRequest } from '../logging/decorators/log-request.decorator';

@ApiTags('Tutoring Requests')
@Controller('tutoring-requests')
export class TutoringRequestsController {
  constructor(private readonly service: TutoringRequestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @LogRequest({ 
    level: 'INFO', 
    includeRequestBody: true,
    excludeSensitiveFields: ['password'] 
  })
  @ApiOperation({ 
    summary: 'Crear una nueva solicitud de tutoría',
    description: 'Permite a un estudiante crear una solicitud de tutoría especificando la materia, fecha y descripción del tema a tratar.'
  })
  @ApiBody({ 
    type: CreateTutoringRequestsDto,
    description: 'Datos de la solicitud de tutoría'
  })
  @ApiCreatedResponse({ 
    description: 'Solicitud de tutoría creada exitosamente',
    type: TutoringRequests
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos o faltantes'
  })
  async create(@Body() createTutoringRequestsDto: CreateTutoringRequestsDto): Promise<TutoringRequests> {
    return this.service.create(createTutoringRequestsDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @LogRequest({ level: 'INFO' })
  @ApiOperation({ 
    summary: 'Obtener todas las solicitudes de tutoría',
    description: 'Retorna una lista de todas las solicitudes de tutoría en el sistema.'
  })
  @ApiOkResponse({ 
    description: 'Lista de solicitudes obtenida exitosamente',
    type: [TutoringRequests]
  })
  async findAll(): Promise<TutoringRequests[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @LogRequest({ level: 'INFO' })
  @ApiOperation({ 
    summary: 'Obtener una solicitud de tutoría por ID',
    description: 'Retorna una solicitud de tutoría específica basada en su ID.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único de la solicitud de tutoría',
    type: Number,
    example: 1
  })
  @ApiOkResponse({ 
    description: 'Solicitud encontrada exitosamente',
    type: TutoringRequests
  })
  @ApiNotFoundResponse({ 
    description: 'Solicitud no encontrada'
  })
  async findOne(@Param('id') id: string): Promise<TutoringRequests> {
    return this.service.findOne(parseInt(id));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @LogRequest({ 
    level: 'INFO', 
    includeRequestBody: true,
    includeResponseBody: true 
  })
  @ApiOperation({ 
    summary: 'Actualizar una solicitud de tutoría',
    description: 'Permite actualizar los datos de una solicitud de tutoría existente.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único de la solicitud de tutoría',
    type: Number,
    example: 1
  })
  @ApiBody({ 
    type: UpdateTutoringRequestsDto,
    description: 'Datos a actualizar en la solicitud'
  })
  @ApiOkResponse({ 
    description: 'Solicitud actualizada exitosamente',
    type: TutoringRequests
  })
  @ApiNotFoundResponse({ 
    description: 'Solicitud no encontrada'
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos'
  })
  async update(@Param('id') id: string, @Body() updateDto: UpdateTutoringRequestsDto): Promise<TutoringRequests> {
    return this.service.update(parseInt(id), updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @LogRequest({ level: 'WARN' })
  @ApiOperation({ 
    summary: 'Eliminar una solicitud de tutoría',
    description: 'Elimina permanentemente una solicitud de tutoría del sistema.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único de la solicitud de tutoría',
    type: Number,
    example: 1
  })
  @ApiOkResponse({ 
    description: 'Solicitud eliminada exitosamente'
  })
  @ApiNotFoundResponse({ 
    description: 'Solicitud no encontrada'
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(parseInt(id));
  }
}
