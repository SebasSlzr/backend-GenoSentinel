import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalRecordsService } from './clinical-records.service';
import { ClinicalRecordsController } from './clinical-records.controller';
import { ClinicalRecord } from './entities/clinical-record.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { TumorType } from '../tumor-types/entities/tumor-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClinicalRecord, Paciente, TumorType]),
  ],
  controllers: [ClinicalRecordsController],
  providers: [ClinicalRecordsService],
  exports: [ClinicalRecordsService],
})
export class ClinicalRecordsModule {}