import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private pacientesRepository: Repository<Paciente>,
  ) {}

  async create(createPacienteDto: CreatePacienteDto): Promise<Paciente> {
    // Verificar si ya existe un paciente con mismo nombre y apellido
    const existingPaciente = await this.pacientesRepository.findOne({
      where: {
        firstName: createPacienteDto.firstName,
        lastName: createPacienteDto.lastName,
        birthDate: new Date(createPacienteDto.birthDate),
      },
    });

    if (existingPaciente) {
      throw new ConflictException('Ya existe un paciente con esos datos');
    }

    const paciente = this.pacientesRepository.create({
      ...createPacienteDto,
      birthDate: new Date(createPacienteDto.birthDate),
    });
    
    return await this.pacientesRepository.save(paciente);
  }

  async findAll(): Promise<Paciente[]> {
    return await this.pacientesRepository.find({
      order: { lastName: 'ASC', firstName: 'ASC' },
      relations: ['clinicalRecords'],
    });
  }

  async findOne(id: string): Promise<Paciente> {
    const paciente = await this.pacientesRepository.findOne({
      where: { id },
      relations: ['clinicalRecords'],
    });
    
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    
    return paciente;
  }

  async update(id: string, updatePacienteDto: UpdatePacienteDto): Promise<Paciente> {
    const paciente = await this.findOne(id);
    
    if (updatePacienteDto.birthDate) {
      updatePacienteDto.birthDate = new Date(updatePacienteDto.birthDate).toISOString().split('T')[0];
    }
    
    Object.assign(paciente, updatePacienteDto);
    return await this.pacientesRepository.save(paciente);
  }

  async remove(id: string): Promise<void> {
    const paciente = await this.findOne(id);
    
    // Verificar si tiene historias clínicas asociadas
    if (paciente.clinicalRecords && paciente.clinicalRecords.length > 0) {
      throw new ConflictException(
        'No se puede eliminar el paciente porque tiene historias clínicas asociadas'
      );
    }
    
    await this.pacientesRepository.remove(paciente);
  }

  async desactivar(id: string): Promise<Paciente> {
    const paciente = await this.findOne(id);
    paciente.status = 'Inactivo';
    return await this.pacientesRepository.save(paciente);
  }

  async buscarPorNombre(nombre: string): Promise<Paciente[]> {
    return await this.pacientesRepository
      .createQueryBuilder('paciente')
      .where('paciente.firstName LIKE :nombre OR paciente.lastName LIKE :nombre', {
        nombre: `%${nombre}%`,
      })
      .orWhere('CONCAT(paciente.firstName, " ", paciente.lastName) LIKE :nombreCompleto', {
        nombreCompleto: `%${nombre}%`,
      })
      .orderBy('paciente.lastName', 'ASC')
      .addOrderBy('paciente.firstName', 'ASC')
      .getMany();
  }
}