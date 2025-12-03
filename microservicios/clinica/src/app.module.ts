import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from './patients/patients.module';
import { TumorTypesModule } from './tumor-types/tumor-types.module';
import { ClinicalRecordsModule } from './clinical-records/clinical-records.module';
import { Patient } from './patients/entities/patient.entity';
import { TumorType } from './tumor-types/entities/tumor-type.entity';
import { ClinicalRecord } from './clinical-records/entities/clinical-record.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT || '3307'),
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB,
            entities: [Patient, TumorType, ClinicalRecord],
            synchronize: true,
            logging: true,
        }),
        PatientsModule,
        TumorTypesModule,
        ClinicalRecordsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}