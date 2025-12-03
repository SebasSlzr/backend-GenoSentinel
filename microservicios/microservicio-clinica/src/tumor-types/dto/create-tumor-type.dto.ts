import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTumorTypeDto {
  @ApiProperty({
    example: 'Cáncer de Mama',
    description: 'Nombre del tipo de tumor',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    example: 'Glándulas mamarias',
    description: 'Sistema u órgano afectado',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  systemAffected: string;
}