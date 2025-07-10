import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CoordinadorService } from './coordinador.service';
import { CreateCoordinadorDto } from './dto/create-coordinador.dto';
import { UpdateCoordinadorDto } from './dto/update-coordinador.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Coordinador } from './entities/coordinador.entity';

@ApiTags('Coordinadores')
@Controller('coordinadores')
export class CoordinadorController {
    constructor(private readonly coordinadorService: CoordinadorService) {}

}