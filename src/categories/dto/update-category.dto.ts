import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Alimentação e Bebidas',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Descrição da categoria',
    example: 'Gastos com alimentação, bebidas e restaurantes',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
