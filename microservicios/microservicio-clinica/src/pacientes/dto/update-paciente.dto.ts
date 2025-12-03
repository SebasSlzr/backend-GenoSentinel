import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePacienteDto } from './create-paciente.dto';
import { IsOptional } from 'class-validator';

export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {
  @ApiProperty({
    example: 'Seguimiento',
    description: 'Nuevo estado del paciente',
    required: false,
  })
  @IsOptional()
  status?: string;
}