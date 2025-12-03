import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicalRecord } from './entities/clinical-record.entity';
import { CreateClinicalRecordDto } from './dto/create-clinical-record.dto';
import { UpdateClinicalRecordDto } from './dto/update-clinical-record.dto';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { TumorType } from '../tumor-types/entities/tumor-type.entity';

@Injectable()
export class ClinicalRecordsService {
  constructor(
    @InjectRepository(ClinicalRecord)
    private clinicalRecordsRepository: Repository<ClinicalRecord>,
    @InjectRepository(Paciente)
    private pacientesRepository: Repository<Paciente>,
    @InjectRepository(TumorType)
    private tumorTypesRepository: Repository<TumorType>,
  ) {}

  async create(createClinicalRecordDto: CreateClinicalRecordDto): Promise<ClinicalRecord> {
    // Verificar que el paciente existe
    const paciente = await this.pacientesRepository.findOne({
      where: { id: createClinicalRecordDto.patientId },
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${createClinicalRecordDto.patientId} no encontrado`);
    }

    // Verificar que el tipo de tumor existe
    const tumorType = await this.tumorTypesRepository.findOne({
      where: { id: createClinicalRecordDto.tumorTypeId },
    });

    if (!tumorType) {
      throw new NotFoundException(`Tipo de tumor con ID ${createClinicalRecordDto.tumorTypeId} no encontrado`);
    }

    // Verificar si ya existe una historia clínica para este paciente con este tumor
    const existingRecord = await this.clinicalRecordsRepository.findOne({
      where: {
        patientId: createClinicalRecordDto.patientId,
        tumorTypeId: createClinicalRecordDto.tumorTypeId,
      },
    });

    if (existingRecord) {
      throw new ConflictException('Ya existe una historia clínica para este paciente con este tipo de tumor');
    }

    const clinicalRecord = this.clinicalRecordsRepository.create({
      ...createClinicalRecordDto,
      patient: paciente,
      tumorType: tumorType,
      diagnosisDate: new Date(createClinicalRecordDto.diagnosisDate),
    });

    return await this.clinicalRecordsRepository.save(clinicalRecord);
  }

  async findAll(): Promise<ClinicalRecord[]> {
    return await this.clinicalRecordsRepository.find({
      relations: ['patient', 'tumorType'],
      order: { diagnosisDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ClinicalRecord> {
    const clinicalRecord = await this.clinicalRecordsRepository.findOne({
      where: { id },
      relations: ['patient', 'tumorType'],
    });
    
    if (!clinicalRecord) {
      throw new NotFoundException(`Historia clínica con ID ${id} no encontrada`);
    }
    
    return clinicalRecord;
  }

  async update(id: string, updateClinicalRecordDto: UpdateClinicalRecordDto): Promise<ClinicalRecord> {
    const clinicalRecord = await this.findOne(id);
    
    // Si se actualiza el paciente, verificar que exista
    if (updateClinicalRecordDto.patientId) {
      const paciente = await this.pacientesRepository.findOne({
        where: { id: updateClinicalRecordDto.patientId },
      });

      if (!paciente) {
        throw new NotFoundException(`Paciente con ID ${updateClinicalRecordDto.patientId} no encontrado`);
      }
      clinicalRecord.patient = paciente;
    }

    // Si se actualiza el tipo de tumor, verificar que exista
    if (updateClinicalRecordDto.tumorTypeId) {
      const tumorType = await this.tumorTypesRepository.findOne({
        where: { id: updateClinicalRecordDto.tumorTypeId },
      });

      if (!tumorType) {
        throw new NotFoundException(`Tipo de tumor con ID ${updateClinicalRecordDto.tumorTypeId} no encontrado`);
      }
      clinicalRecord.tumorType = tumorType;
    }

    // Actualizar los demás campos
    Object.assign(clinicalRecord, updateClinicalRecordDto);
    
    if (updateClinicalRecordDto.diagnosisDate) {
      clinicalRecord.diagnosisDate = new Date(updateClinicalRecordDto.diagnosisDate);
    }

    return await this.clinicalRecordsRepository.save(clinicalRecord);
  }

  async remove(id: string): Promise<void> {
    const clinicalRecord = await this.findOne(id);
    await this.clinicalRecordsRepository.remove(clinicalRecord);
  }

  async findByPatientId(patientId: string): Promise<ClinicalRecord[]> {
    return await this.clinicalRecordsRepository.find({
      where: { patientId },
      relations: ['patient', 'tumorType'],
      order: { diagnosisDate: 'DESC' },
    });
  }

  async findByTumorTypeId(tumorTypeId: number): Promise<ClinicalRecord[]> {
    return await this.clinicalRecordsRepository.find({
      where: { tumorTypeId },
      relations: ['patient', 'tumorType'],
      order: { diagnosisDate: 'DESC' },
    });
  }

  async buscarPorEtapa(stage: string): Promise<ClinicalRecord[]> {
    return await this.clinicalRecordsRepository.find({
      where: { stage },
      relations: ['patient', 'tumorType'],
      order: { diagnosisDate: 'DESC' },
    });
  }

  async getEstadisticas(): Promise<{
    total: number;
    porEtapa: Record<string, number>;
    porTumor: Array<{ tumor: string; count: number }>;
  }> {
    const total = await this.clinicalRecordsRepository.count();
    
    // Contar por etapa
    const porEtapa = await this.clinicalRecordsRepository
      .createQueryBuilder('record')
      .select('record.stage, COUNT(*) as count')
      .groupBy('record.stage')
      .getRawMany();

    // Contar por tipo de tumor
    const porTumor = await this.clinicalRecordsRepository
      .createQueryBuilder('record')
      .innerJoin('record.tumorType', 'tumorType')
      .select('tumorType.name as tumor, COUNT(*) as count')
      .groupBy('tumorType.name')
      .orderBy('count', 'DESC')
      .getRawMany();

    return {
      total,
      porEtapa: porEtapa.reduce((acc, curr) => {
        acc[curr.stage] = parseInt(curr.count);
        return acc;
      }, {}),
      porTumor,
    };
  }
}