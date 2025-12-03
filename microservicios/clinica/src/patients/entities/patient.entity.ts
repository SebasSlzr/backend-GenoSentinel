import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ClinicalRecord } from '../../clinical-records/entities/clinical-record.entity';

@Entity('patients')
export class Patient {
    @PrimaryGeneratedColumn('uuid', { name: 'patient_id' })
    patientId: string;

    @Column({ name: 'first_name', length: 100 })
    firstName: string;

    @Column({ name: 'last_name', length: 100 })
    lastName: string;

    @Column({ name: 'birth_date', type: 'date' })
    birthDate: Date;

    @Column({ name: 'gender', length: 20 })
    gender: string;

    @Column({ name: 'status', length: 50, default: 'Activo' })
    status: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => ClinicalRecord, (clinicalRecord) => clinicalRecord.patient)
    clinicalRecords: ClinicalRecord[];
}