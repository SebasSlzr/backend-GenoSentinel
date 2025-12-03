import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpStatus
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery
} from '@nestjs/swagger';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';

@ApiTags('pacientes')
@Controller('pacientes')
export class PacientesController {
    constructor(private readonly pacientesService: PacientesService) {}

    @Post()
    @ApiOperation({
        summary: 'Crear un nuevo paciente',
        description: 'Registra un nuevo paciente en el sistema con sus datos personales'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Paciente creado exitosamente',
        type: Paciente
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Ya existe un paciente con esos datos'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos de entrada inválidos'
    })
    create(@Body() createPacienteDto: CreatePacienteDto): Promise<Paciente> {
        return this.pacientesService.create(createPacienteDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener todos los pacientes',
        description: 'Retorna una lista de todos los pacientes registrados en el sistema'
    })
    @ApiQuery({
        name: 'nombre',
        required: false,
        description: 'Filtrar pacientes por nombre o apellido',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de pacientes obtenida exitosamente',
        type: [Paciente]
    })
    findAll(@Query('nombre') nombre?: string): Promise<Paciente[]> {
        if (nombre) {
            return this.pacientesService.buscarPorNombre(nombre);
        }
        return this.pacientesService.findAll();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un paciente por ID',
        description: 'Retorna los datos de un paciente específico usando su ID único'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del paciente (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Paciente encontrado',
        type: Paciente
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Paciente no encontrado'
    })
    findOne(@Param('id') id: string): Promise<Paciente> {
        return this.pacientesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar un paciente',
        description: 'Actualiza los datos de un paciente existente'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del paciente a actualizar',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Paciente actualizado exitosamente',
        type: Paciente
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Paciente no encontrado'
    })
    update(
        @Param('id') id: string,
        @Body() updatePacienteDto: UpdatePacienteDto,
    ): Promise<Paciente> {
        return this.pacientesService.update(id, updatePacienteDto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar un paciente',
        description: 'Elimina permanentemente un paciente del sistema. Solo posible si no tiene historias clínicas asociadas.'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del paciente a eliminar',
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Paciente eliminado exitosamente'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Paciente no encontrado'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'No se puede eliminar porque tiene historias clínicas asociadas'
    })
    remove(@Param('id') id: string): Promise<void> {
        return this.pacientesService.remove(id);
    }

    @Patch(':id/desactivar')
    @ApiOperation({
        summary: 'Desactivar un paciente',
        description: 'Cambia el estado del paciente a "Inactivo" en lugar de eliminarlo'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del paciente a desactivar',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Paciente desactivado exitosamente',
        type: Paciente
    })
    desactivar(@Param('id') id: string): Promise<Paciente> {
        return this.pacientesService.desactivar(id);
    }
}