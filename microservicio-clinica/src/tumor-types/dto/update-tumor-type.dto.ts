import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTumorTypeDto } from './create-tumor-type.dto';
import { IsOptional, MaxLength } from 'class-validator';

export class UpdateTumorTypeDto extends PartialType(CreateTumorTypeDto) {
  @ApiProperty({
    example: 'Código actualizado',
    description: 'Nuevo código ICD-10',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @MaxLength(50)
  icd10Code?: string;
}