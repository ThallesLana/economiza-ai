import { IsEnum, IsISO8601, IsOptional, IsUUID } from 'class-validator';
import { TransactionType } from 'src/common/enums/transaction-type.enum';

export class FilterGetTransactionDto {
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsISO8601()
  @IsOptional()
  transactionDate?: string;
}
