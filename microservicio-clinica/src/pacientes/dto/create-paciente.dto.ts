import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsDateString, 
  IsEnum, 
  IsNotEmpty, 
  MaxLength, 
  MinLength 
} from 'class-validator';

export class CreatePacienteDto {
  @ApiProperty({
    example: 'María',
    description: 'Nombre del paciente',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    example: 'García',
    description: 'Apellido del paciente',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    example: '1985-06-15',
    description: 'Fecha de nacimiento en formato YYYY-MM-DD',
  })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({
    example: 'Femenino',
    description: 'Género del paciente',
    enum: ['Masculino', 'Femenino', 'Otro'],
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['Masculino', 'Femenino', 'Otro'])
  gender: string;

  @ApiProperty({
    example: 'Activo',
    description: 'Estado del paciente',
    enum: ['Activo', 'Seguimiento', 'Inactivo'],
    required: false,
    default: 'Activo',
  })
  @IsString()
  @IsEnum(['Activo', 'Seguimiento', 'Inactivo'])
  status?: string;
}