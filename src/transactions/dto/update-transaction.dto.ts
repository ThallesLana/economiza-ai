import {
  IsDecimal,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionType } from 'src/common/enums/transaction-type.enum';

export class UpdateTransactionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDecimal()
  @IsOptional()
  amount?: number;

  @IsEnum(TransactionType)
  @IsString()
  @IsOptional()
  type?: TransactionType;

  @IsString()
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsISO8601()
  @IsOptional()
  transactionDate?: string;
}
