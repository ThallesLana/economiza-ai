import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtPayload } from 'src/common/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transactions.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { isUUID } from 'class-validator';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

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

  async findAll(user: JwtPayload) {
    return await this.repository.find({
      where: { userId: user.id },
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
}
