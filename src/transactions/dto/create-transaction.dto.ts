import {
  IsDecimal,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Nome da transação',
    example: 'Salário',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descrição da transação (opcional)',
    example: 'Salário mensal',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Valor da transação',
    example: 5000.0,
    type: 'number',
  })
  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Tipo da transação',
    enum: TransactionType,
    example: TransactionType.INCOME,
  })
  @IsEnum(TransactionType)
  @IsString()
  @IsNotEmpty()
  type: TransactionType;

  @ApiProperty({
    description: 'ID da categoria (opcional)',
    example: 'uuid-categoria',
    required: false,
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    description: 'Data da transação',
    example: '2023-12-01T00:00:00.000Z',
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsISO8601()
  transactionDate: string;

  @ApiProperty({
    description: 'ID do usuário',
    example: 'uuid-usuario',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
