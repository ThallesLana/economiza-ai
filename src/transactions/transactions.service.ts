import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { isUUID } from 'class-validator';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterGetTransactionDto } from './dto/filter-get-transaction.dto';
import { FinancialSummaryFilterDto } from './dto/financial-summary-filter.dto';
import { FinancialSummaryDto } from './dto/financial-summary.dto';
import { Transaction } from './entities/transactions.entity';
import {
  JwtPayload,
  FinancialSummaryRaw,
  FilterGetTransaction,
} from '../common/interfaces';
import { CategoriesService } from 'src/categories/categories.service';
import { buildDateFilter } from '../common/utils/date-filter.util';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(user: JwtPayload, createTransactionDto: CreateTransactionDto) {
    createTransactionDto.userId = user.id;

    if (createTransactionDto.categoryId !== undefined) {
      const categoryExists = await this.categoriesService.findOne(
        createTransactionDto.categoryId,
      );

      if (!categoryExists) {
        throw new NotFoundException('Category not found');
      }
    }

    const newTransaction = this.repository.create(createTransactionDto);

    return this.repository.save(newTransaction);
  }

  async findAll(user: JwtPayload, filterDto: FilterGetTransactionDto) {
    const whereClause: FilterGetTransaction = { userId: user.id };

    if (filterDto.type) whereClause.type = filterDto.type;
    if (filterDto.categoryId) whereClause.categoryId = filterDto.categoryId;
    if (filterDto.transactionDate)
      whereClause.transactionDate = filterDto.transactionDate;

    return await this.repository.find({
      where: whereClause as FindOptionsWhere<Transaction>,
    });
  }

  async findOne(user: JwtPayload, id: string) {
    if (!isUUID(id)) throw new NotFoundException('Invalid id');

    const transaction = await this.repository.findOne({
      where: { id, userId: user.id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(
    user: JwtPayload,
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    if (!isUUID(id)) throw new NotFoundException('Invalid id');

    const transaction = await this.repository.findOne({
      where: { id, userId: user.id },
    });

    if (updateTransactionDto.categoryId !== undefined) {
      const categoryExists = await this.categoriesService.findOne(
        updateTransactionDto.categoryId,
      );

      if (!categoryExists) {
        throw new NotFoundException('Category not found');
      }
    }

    if (!transaction) throw new NotFoundException('Transaction not found');

    this.repository.merge(transaction, updateTransactionDto);

    return this.repository.save(transaction);
  }

  async remove(user: JwtPayload, id: string) {
    if (!isUUID(id)) throw new NotFoundException('Invalid id');

    const transaction = await this.repository.findOne({
      where: { id, userId: user.id },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    return this.repository.remove(transaction);
  }

  async getFinancialSummary(
    user: JwtPayload,
    filters: FinancialSummaryFilterDto,
  ): Promise<FinancialSummaryDto> {
    const queryBuilder = this.repository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId: user.id });

    const { startDate, endDate, year } = buildDateFilter(filters);

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'transaction.transactionDate BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    }

    if (year) {
      queryBuilder.andWhere(
        'EXTRACT(YEAR FROM transaction.transactionDate) = :year',
        { year },
      );
    }

    if (filters.categoryId) {
      queryBuilder.andWhere('transaction.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    const result: FinancialSummaryRaw | undefined = await queryBuilder
      .select([
        "SUM(CASE WHEN transaction.type = 'income' THEN transaction.amount ELSE 0 END) as totalincome",
        "SUM(CASE WHEN transaction.type = 'expense' THEN transaction.amount ELSE 0 END) as totalexpense",
        'COUNT(*) as totaltransactions',
      ])
      .getRawOne();

    const totalIncome = parseFloat(result?.totalincome || '0') || 0;
    const totalExpense = parseFloat(result?.totalexpense || '0') || 0;
    const totalTransactions = parseInt(result?.totaltransactions || '0') || 0;
    const period = {
      startDate: filters.startDate || '',
      endDate: filters.endDate || '',
    };

    return new FinancialSummaryDto(
      totalIncome,
      totalExpense,
      totalTransactions,
      String(year || ''),
      period,
    );
  }
}
