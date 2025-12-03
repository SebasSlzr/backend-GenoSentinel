import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ClinicalRecord } from '../../clinical-records/entities/clinical-record.entity';

@Entity('pacientes')
export class Paciente {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único del paciente (UUID)',
  })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({
    example: 'María',
    description: 'Nombre del paciente',
    maxLength: 100,
  })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({
    example: 'García',
    description: 'Apellido del paciente',
    maxLength: 100,
  })
  lastName: string;

  @Column({ type: 'date' })
  @ApiProperty({
    example: '1985-06-15',
    description: 'Fecha de nacimiento del paciente',
  })
  birthDate: Date;

  @Column({ type: 'varchar', length: 20 })
  @ApiProperty({
    example: 'Femenino',
    description: 'Género del paciente',
    enum: ['Masculino', 'Femenino', 'Otro'],
  })
  gender: string;

  @Column({ 
    type: 'varchar', 
    length: 50,
    default: 'Activo'
  })
  @ApiProperty({
    example: 'Activo',
    description: 'Estado del paciente en el sistema',
    enum: ['Activo', 'Seguimiento', 'Inactivo'],
    default: 'Activo',
  })
  status: string;

  @CreateDateColumn()
  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Fecha de creación del registro',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    example: '2024-01-16T14:45:00.000Z',
    description: 'Fecha de última actualización',
  })
  updatedAt: Date;

  @OneToMany(() => ClinicalRecord, clinicalRecord => clinicalRecord.patient)
  @ApiProperty({
    description: 'Historias clínicas asociadas al paciente',
    type: () => [ClinicalRecord],
  })
  clinicalRecords: ClinicalRecord[];
}