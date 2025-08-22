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

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @IsEnum(TransactionType)
  @IsString()
  @IsNotEmpty()
  type: TransactionType;

  @IsString()
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsNotEmpty()
  @IsISO8601()
  transactionDate: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
