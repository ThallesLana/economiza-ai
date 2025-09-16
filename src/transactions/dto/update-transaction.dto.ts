import {
  IsDecimal,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionDto {
  @ApiProperty({
    description: 'Nome da transação',
    example: 'Freelance',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Descrição da transação',
    example: 'Trabalho freelance',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Valor da transação',
    example: 2000.0,
    type: 'number',
    required: false,
  })
  @IsDecimal()
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Tipo da transação',
    enum: TransactionType,
    example: TransactionType.INCOME,
    required: false,
  })
  @IsEnum(TransactionType)
  @IsString()
  @IsOptional()
  type?: TransactionType;

  @ApiProperty({
    description: 'ID da categoria',
    example: 'uuid-categoria-freelance',
    required: false,
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    description: 'Data da transação',
    example: '2023-12-15T00:00:00.000Z',
    required: false,
    format: 'date-time',
  })
  @IsISO8601()
  @IsOptional()
  transactionDate?: string;
}
