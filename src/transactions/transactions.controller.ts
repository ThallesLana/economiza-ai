import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/common/interfaces';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterGetTransactionDto } from './dto/filter-get-transaction.dto';

@Controller('transactions')
@UseGuards(JwtGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @User() user: JwtPayload,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return await this.transactionsService.create(user, createTransactionDto);
  }

  @Get()
  async findAll(
    @User() user: JwtPayload,
    @Body() filterDto: FilterGetTransactionDto,
  ) {
    return await this.transactionsService.findAll(user, filterDto);
  }

  @Get(':id')
  async findOne(@User() user: JwtPayload, @Param('id') id: string) {
    return await this.transactionsService.findOne(user, id);
  }

  @Patch(':id')
  async update(
    @User() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return await this.transactionsService.update(
      user,
      id,
      updateTransactionDto,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@User() user: JwtPayload, @Param('id') id: string) {
    return await this.transactionsService.remove(user, id);
  }
}
