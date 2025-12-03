import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { TumorType } from '../../tumor-types/entities/tumor-type.entity';

@Entity('clinical_records')
export class ClinicalRecord {
    @PrimaryGeneratedColumn('uuid', { name: 'clinical_record_id' })
    clinicalRecordId: string;

    @Column({ name: 'patient_id' })
    patientId: string;

    @Column({ name: 'tumor_type_id' })
    tumorTypeId: number;

    @Column({ name: 'diagnosis_date', type: 'date' })
    diagnosisDate: Date;

    @Column({ name: 'stage', length: 50 })
    stage: string;

    @Column({ name: 'treatment_protocol', type: 'text' })
    treatmentProtocol: string;

    @Column({ name: 'notes', type: 'text', nullable: true })
    notes: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Patient, (patient) => patient.clinicalRecords)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;

    @ManyToOne(() => TumorType, (tumorType) => tumorType.clinicalRecords)
    @JoinColumn({ name: 'tumor_type_id' })
    tumorType: TumorType;
}