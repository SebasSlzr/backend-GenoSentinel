import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  HttpStatus,
  UseGuards 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { TumorTypesService } from './tumor-types.service';
import { CreateTumorTypeDto } from './dto/create-tumor-type.dto';
import { UpdateTumorTypeDto } from './dto/update-tumor-type.dto';
import { TumorType } from './entities/tumor-type.entity';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('tumor-types')
@ApiBearerAuth('JWT-auth')
@Controller('tumor-types')
@UseGuards(AuthGuard)
export class TumorTypesController {
  constructor(private readonly tumorTypesService: TumorTypesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear un nuevo tipo de tumor',
    description: 'Agrega un nuevo tipo de tumor al catálogo oncológico'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Tipo de tumor creado exitosamente',
    type: TumorType 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Ya existe un tipo de tumor con ese nombre' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos' 
  })
  create(@Body() createTumorTypeDto: CreateTumorTypeDto): Promise<TumorType> {
    return this.tumorTypesService.create(createTumorTypeDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los tipos de tumor',
    description: 'Retorna una lista de todos los tipos de tumor registrados'
  })
  @ApiQuery({
    name: 'nombre',
    required: false,
    description: 'Filtrar por nombre del tumor o sistema afectado',
    type: String,
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de tipos de tumor obtenida exitosamente',
    type: [TumorType] 
  })
  findAll(
    @Query('nombre') nombre?: string,
  ): Promise<TumorType[]> {
    if (nombre) {
      return this.tumorTypesService.buscarPorNombre(nombre);
    }
    return this.tumorTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener un tipo de tumor por ID',
    description: 'Retorna los datos de un tipo de tumor específico'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de tumor',
    example: 1,
    type: Number,
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Tipo de tumor encontrado',
    type: TumorType 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Tipo de tumor no encontrado' 
  })
  findOne(@Param('id') id: string): Promise<TumorType> {
    return this.tumorTypesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar un tipo de tumor',
    description: 'Actualiza los datos de un tipo de tumor existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de tumor a actualizar',
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Tipo de tumor actualizado exitosamente',
    type: TumorType 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Tipo de tumor no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Ya existe un tipo de tumor con ese nombre' 
  })
  update(
    @Param('id') id: string,
    @Body() updateTumorTypeDto: UpdateTumorTypeDto,
  ): Promise<TumorType> {
    return this.tumorTypesService.update(+id, updateTumorTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar un tipo de tumor',
    description: 'Elimina un tipo de tumor del catálogo. Solo posible si no tiene historias clínicas asociadas.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de tumor a eliminar',
  })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Tipo de tumor eliminado exitosamente' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Tipo de tumor no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'No se puede eliminar porque tiene historias clínicas asociadas' 
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.tumorTypesService.remove(+id);
  }
}