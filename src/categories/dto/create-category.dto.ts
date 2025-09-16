import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Alimentação',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descrição da categoria (opcional)',
    example: 'Gastos com comida e bebidas',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'ID do usuário',
    example: 'uuid-usuario',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
