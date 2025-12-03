import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateClinicalRecordDto } from './create-clinical-record.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateClinicalRecordDto extends PartialType(CreateClinicalRecordDto) {
  @ApiProperty({
    example: 'Paciente en remisión completa',
    description: 'Observaciones adicionales actualizadas',
    required: false,
  })
  @IsString()
  @IsOptional()
  observations?: string;
}