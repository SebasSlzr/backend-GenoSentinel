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
import { ClinicalRecordsService } from './clinical-records.service';
import { CreateClinicalRecordDto } from './dto/create-clinical-record.dto';
import { UpdateClinicalRecordDto } from './dto/update-clinical-record.dto';
import { ClinicalRecord } from './entities/clinical-record.entity';

@ApiTags('clinical-records')
@Controller('clinical-records')
export class ClinicalRecordsController {
    constructor(private readonly clinicalRecordsService: ClinicalRecordsService) {}

    @Post()
    @ApiOperation({
        summary: 'Crear una nueva historia clínica',
        description: 'Registra una nueva historia clínica para un paciente con diagnóstico oncológico'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Historia clínica creada exitosamente',
        type: ClinicalRecord
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Paciente o tipo de tumor no encontrado'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Ya existe una historia clínica para este paciente con este tipo de tumor'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos de entrada inválidos'
    })
    create(@Body() createClinicalRecordDto: CreateClinicalRecordDto): Promise<ClinicalRecord> {
        return this.clinicalRecordsService.create(createClinicalRecordDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener todas las historias clínicas',
        description: 'Retorna una lista de todas las historias clínicas registradas'
    })
    @ApiQuery({
        name: 'patientId',
        required: false,
        description: 'Filtrar por ID del paciente',
        type: String,
    })
    @ApiQuery({
        name: 'tumorTypeId',
        required: false,
        description: 'Filtrar por ID del tipo de tumor',
        type: Number,
    })
    @ApiQuery({
        name: 'stage',
        required: false,
        description: 'Filtrar por etapa del cáncer',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de historias clínicas obtenida exitosamente',
        type: [ClinicalRecord]
    })
    findAll(
        @Query('patientId') patientId?: string,
        @Query('tumorTypeId') tumorTypeId?: string,
        @Query('stage') stage?: string,
    ): Promise<ClinicalRecord[]> {
        if (patientId) {
            return this.clinicalRecordsService.findByPatientId(patientId);
        }
        if (tumorTypeId) {
            return this.clinicalRecordsService.findByTumorTypeId(+tumorTypeId);
        }
        if (stage) {
            return this.clinicalRecordsService.buscarPorEtapa(stage);
        }
        return this.clinicalRecordsService.findAll();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener una historia clínica por ID',
        description: 'Retorna los datos de una historia clínica específica'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la historia clínica (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Historia clínica encontrada',
        type: ClinicalRecord
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Historia clínica no encontrada'
    })
    findOne(@Param('id') id: string): Promise<ClinicalRecord> {
        return this.clinicalRecordsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar una historia clínica',
        description: 'Actualiza los datos de una historia clínica existente'
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la historia clínica a actualizar',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Historia clínica actualizada exitosamente',
        type: ClinicalRecord
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Historia clínica, paciente o tipo de tumor no encontrado'
    })
    update(
        @Param('id') id: string,
        @Body() updateClinicalRecordDto: UpdateClinicalRecordDto,
    ): Promise<ClinicalRecord> {
        return this.clinicalRecordsService.update(id, updateClinicalRecordDto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar una historia clínica',
        description: 'Elimina permanentemente una historia clínica'
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la historia clínica a eliminar',
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Historia clínica eliminada exitosamente'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Historia clínica no encontrada'
    })
    remove(@Param('id') id: string): Promise<void> {
        return this.clinicalRecordsService.remove(id);
    }

    @Get('estadisticas/resumen')
    @ApiOperation({
        summary: 'Obtener estadísticas de historias clínicas',
        description: 'Retorna estadísticas generales sobre las historias clínicas registradas'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Estadísticas obtenidas exitosamente'
    })
    getEstadisticas() {
        return this.clinicalRecordsService.getEstadisticas();
    }
}