import { IsEnum, IsISO8601, IsOptional, IsUUID } from 'class-validator';
import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class FilterGetTransactionDto {
  @ApiProperty({
    description: 'Filtrar por tipo de transação',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
    required: false,
  })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @ApiProperty({
    description: 'Filtrar por ID da categoria',
    example: 'uuid-categoria-alimentacao',
    required: false,
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    description: 'Filtrar por data da transação',
    example: '2023-12-01T00:00:00.000Z',
    required: false,
    format: 'date-time',
  })
  @IsISO8601()
  @IsOptional()
  transactionDate?: string;
}
