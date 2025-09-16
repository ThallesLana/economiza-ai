import {
  IsOptional,
  IsDateString,
  IsUUID,
  IsInt,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class FinancialSummaryFilterDto {
  @IsOptional()
  @IsDateString()
  @ValidateIf((o) => !o.year)
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @ValidateIf((o) => !o.year)
  endDate?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(2000)
  @Max(new Date().getFullYear())
  @ValidateIf((o) => !o.startDate && !o.endDate)
  year?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(12)
  @ValidateIf((o) => o.year)
  month?: number;
}
