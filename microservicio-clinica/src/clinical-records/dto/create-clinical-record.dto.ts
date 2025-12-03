import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsDateString, 
  IsNotEmpty, 
  IsUUID, 
  IsInt, 
  IsEnum
} from 'class-validator';

export class CreateClinicalRecordDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del paciente (UUID)',
  })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({
    example: 1,
    description: 'ID del tipo de tumor',
  })
  @IsInt()
  @IsNotEmpty()
  tumorTypeId: number;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Fecha del diagnóstico',
  })
  @IsDateString()
  @IsNotEmpty()
  diagnosisDate: string;

  @ApiProperty({
    example: 'IIA',
    description: 'Etapa del cáncer',
    enum: ['I', 'IA', 'IB', 'II', 'IIA', 'IIB', 'III', 'IIIA', 'IIIB', 'IIIC', 'IV'],
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['I', 'IA', 'IB', 'II', 'IIA', 'IIB', 'III', 'IIIA', 'IIIB', 'IIIC', 'IV'])
  stage: string;

  @ApiProperty({
    example: 'Quimioterapia adyuvante con ciclofosfamida y doxorrubicina',
    description: 'Protocolo de tratamiento',
  })
  @IsString()
  @IsNotEmpty()
  treatmentProtocol: string;
}