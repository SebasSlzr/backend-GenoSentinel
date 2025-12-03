import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { TumorType } from '../../tumor-types/entities/tumor-type.entity';

@Entity('clinical_records')
export class ClinicalRecord {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único de la historia clínica',
  })
  id: string;

  @ManyToOne(() => Paciente, paciente => paciente.clinicalRecords, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'patientId' })
  @ApiProperty({
    description: 'Paciente asociado a esta historia clínica',
    type: () => Paciente,
  })
  patient: Paciente;

  @Column({ name: 'patientId' })
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del paciente',
  })
  patientId: string;

  @ManyToOne(() => TumorType, tumorType => tumorType.clinicalRecords, {
    nullable: false,
  })
  @JoinColumn({ name: 'tumorTypeId' })
  @ApiProperty({
    description: 'Tipo de tumor diagnosticado',
    type: () => TumorType,
  })
  tumorType: TumorType;

  @Column({ name: 'tumorTypeId' })
  @ApiProperty({
    example: 1,
    description: 'ID del tipo de tumor',
  })
  tumorTypeId: number;

  @Column({ type: 'date' })
  @ApiProperty({
    example: '2024-01-15',
    description: 'Fecha del diagnóstico',
  })
  diagnosisDate: Date;

  @Column({ type: 'varchar', length: 20 })
  @ApiProperty({
    example: 'IIA',
    description: 'Etapa del cáncer',
    enum: ['I', 'IA', 'IB', 'II', 'IIA', 'IIB', 'III', 'IIIA', 'IIIB', 'IIIC', 'IV'],
  })
  stage: string;

  @Column({ type: 'text' })
  @ApiProperty({
    example: 'Quimioterapia adyuvante con ciclofosfamida y doxorrubicina',
    description: 'Protocolo de tratamiento asignado',
  })
  treatmentProtocol: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha de creación del registro',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'Fecha de última actualización',
  })
  updatedAt: Date;
}