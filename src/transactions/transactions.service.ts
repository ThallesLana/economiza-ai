import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtPayload } from 'src/common/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transactions.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';

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
}
