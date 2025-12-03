import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ClinicalRecord } from '../../clinical-records/entities/clinical-record.entity';

@Entity('tumor_types')
export class TumorType {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'ID único del tipo de tumor',
  })
  id: number;

  @Column({ type: 'varchar', length: 200, unique: true })
  @ApiProperty({
    example: 'Cáncer de Mama',
    description: 'Nombre del tipo de tumor',
    maxLength: 200,
  })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({
    example: 'Glándulas mamarias',
    description: 'Sistema u órgano afectado',
    maxLength: 100,
  })
  systemAffected: string;

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

  @OneToMany(() => ClinicalRecord, clinicalRecord => clinicalRecord.tumorType)
  @ApiProperty({
    description: 'Historias clínicas asociadas a este tipo de tumor',
    type: () => [ClinicalRecord],
  })
  clinicalRecords: ClinicalRecord[];
}