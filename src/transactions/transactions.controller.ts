import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/common/interfaces';

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
}
