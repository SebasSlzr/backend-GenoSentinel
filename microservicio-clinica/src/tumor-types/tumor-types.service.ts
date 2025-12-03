import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TumorType } from './entities/tumor-type.entity';
import { CreateTumorTypeDto } from './dto/create-tumor-type.dto';
import { UpdateTumorTypeDto } from './dto/update-tumor-type.dto';

@Injectable()
export class TumorTypesService {
  constructor(
    @InjectRepository(TumorType)
    private tumorTypesRepository: Repository<TumorType>,
  ) {}

  async create(createTumorTypeDto: CreateTumorTypeDto): Promise<TumorType> {
    // Verificar si ya existe un tipo de tumor con el mismo nombre
    const existingTumor = await this.tumorTypesRepository.findOne({
      where: { name: createTumorTypeDto.name },
    });

    if (existingTumor) {
      throw new ConflictException('Ya existe un tipo de tumor con ese nombre');
    }

    const tumorType = this.tumorTypesRepository.create(createTumorTypeDto);
    return await this.tumorTypesRepository.save(tumorType);
  }

  async findAll(): Promise<TumorType[]> {
    return await this.tumorTypesRepository.find({
      order: { name: 'ASC' },
      relations: ['clinicalRecords'],
    });
  }

  async findOne(id: number): Promise<TumorType> {
    const tumorType = await this.tumorTypesRepository.findOne({
      where: { id },
      relations: ['clinicalRecords'],
    });
    
    if (!tumorType) {
      throw new NotFoundException(`Tipo de tumor con ID ${id} no encontrado`);
    }
    
    return tumorType;
  }

  async update(id: number, updateTumorTypeDto: UpdateTumorTypeDto): Promise<TumorType> {
    const tumorType = await this.findOne(id);
    
    // Verificar si el nuevo nombre ya existe (si se está actualizando)
    if (updateTumorTypeDto.name && updateTumorTypeDto.name !== tumorType.name) {
      const existingTumor = await this.tumorTypesRepository.findOne({
        where: { name: updateTumorTypeDto.name },
      });
      
      if (existingTumor) {
        throw new ConflictException('Ya existe un tipo de tumor con ese nombre');
      }
    }
    
    Object.assign(tumorType, updateTumorTypeDto);
    return await this.tumorTypesRepository.save(tumorType);
  }

  async remove(id: number): Promise<void> {
    const tumorType = await this.findOne(id);
    
    // Verificar si tiene historias clínicas asociadas
    if (tumorType.clinicalRecords && tumorType.clinicalRecords.length > 0) {
      throw new ConflictException(
        'No se puede eliminar el tipo de tumor porque tiene historias clínicas asociadas'
      );
    }
    
    await this.tumorTypesRepository.remove(tumorType);
  }

  async buscarPorNombre(nombre: string): Promise<TumorType[]> {
    return await this.tumorTypesRepository
      .createQueryBuilder('tumorType')
      .where('tumorType.name LIKE :nombre', { nombre: `%${nombre}%` })
      .orWhere('tumorType.systemAffected LIKE :nombre', { nombre: `%${nombre}%` })
      .orderBy('tumorType.name', 'ASC')
      .getMany();
  }
}