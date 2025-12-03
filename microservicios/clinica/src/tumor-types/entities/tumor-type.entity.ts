import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ClinicalRecord } from '../../clinical-records/entities/clinical-record.entity';

@Entity('tumor_types')
export class TumorType {
    @PrimaryGeneratedColumn({ name: 'tumor_type_id' })
    tumorTypeId: number;

    @Column({ name: 'name', length: 150, unique: true })
    name: string;

    @Column({ name: 'system_affected', length: 150 })
    systemAffected: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToMany(() => ClinicalRecord, (clinicalRecord) => clinicalRecord.tumorType)
    clinicalRecords: ClinicalRecord[];
}