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
  Query,
} from '@nestjs/common';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/common/interfaces';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterGetTransactionDto } from './dto/filter-get-transaction.dto';
import { FinancialSummaryFilterDto } from './dto/financial-summary-filter.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar nova transação',
    description:
      'Cria uma nova transação financeira para o usuário autenticado',
  })
  @ApiBody({
    type: CreateTransactionDto,
    description: 'Dados para criação da transação',
    examples: {
      income: {
        summary: 'Receita - Salário',
        value: {
          name: 'Salário',
          description: 'Salário mensal',
          amount: 5000.0,
          type: 'income',
          categoryId: 'uuid-categoria-salario',
          transactionDate: '2023-12-01T00:00:00.000Z',
          userId: 'uuid-usuario',
        },
      },
      expense: {
        summary: 'Despesa - Supermercado',
        value: {
          name: 'Compras do mês',
          description: 'Compras no supermercado',
          amount: 350.75,
          type: 'expense',
          categoryId: 'uuid-categoria-alimentacao',
          transactionDate: '2023-12-01T10:30:00.000Z',
          userId: 'uuid-usuario',
        },
      },
      minimal: {
        summary: 'Transação mínima',
        value: {
          name: 'Transação simples',
          amount: 100.0,
          type: 'expense',
          transactionDate: '2023-12-01T00:00:00.000Z',
          userId: 'uuid-usuario',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso',
    schema: {
      example: {
        id: 'uuid-transacao',
        name: 'Salário',
        description: 'Salário mensal',
        amount: 5000.0,
        type: 'income',
        categoryId: 'uuid-categoria-salario',
        transactionDate: '2023-12-01T00:00:00.000Z',
        userId: 'uuid-usuario',
        createdAt: '2023-12-01T00:00:00.000Z',
        updatedAt: '2023-12-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'amount must be a decimal number',
          'type must be one of the following values: income, expense',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  async create(
    @User() user: JwtPayload,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return await this.transactionsService.create(user, createTransactionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar transações',
    description:
      'Retorna todas as transações do usuário autenticado com filtros opcionais via query parameters',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['income', 'expense'],
    description: 'Filtrar por tipo de transação',
    example: 'expense',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: 'string',
    description: 'Filtrar por ID da categoria',
    example: 'uuid-categoria-alimentacao',
  })
  @ApiQuery({
    name: 'transactionDate',
    required: false,
    type: 'string',
    format: 'date-time',
    description: 'Filtrar por data da transação (ISO 8601)',
    example: '2023-12-01T00:00:00.000Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de transações retornada com sucesso',
    schema: {
      example: [
        {
          id: 'uuid-transacao-1',
          name: 'Salário',
          description: 'Salário mensal',
          amount: 5000.0,
          type: 'income',
          categoryId: 'uuid-categoria-salario',
          transactionDate: '2023-12-01T00:00:00.000Z',
          userId: 'uuid-usuario',
          createdAt: '2023-12-01T00:00:00.000Z',
          updatedAt: '2023-12-01T00:00:00.000Z',
        },
        {
          id: 'uuid-transacao-2',
          name: 'Supermercado',
          amount: 350.75,
          type: 'expense',
          categoryId: 'uuid-categoria-alimentacao',
          transactionDate: '2023-12-01T10:30:00.000Z',
          userId: 'uuid-usuario',
          createdAt: '2023-12-01T10:30:00.000Z',
          updatedAt: '2023-12-01T10:30:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  async findAll(
    @User() user: JwtPayload,
    @Query() filterDto: FilterGetTransactionDto,
  ) {
    return await this.transactionsService.findAll(user, filterDto);
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Resumo financeiro do usuário',
    description:
      'Retorna o resumo financeiro do usuário autenticado, incluindo receitas, despesas, saldo, total de transações e período filtrado. Permite filtros por data, categoria, ano e mês.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: 'string',
    format: 'date-time',
    description:
      'Data inicial do período (ISO 8601). Ignorado se year for informado.',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: 'string',
    format: 'date-time',
    description:
      'Data final do período (ISO 8601). Ignorado se year for informado.',
    example: '2024-12-31T23:59:59.000Z',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: 'string',
    description: 'Filtrar por ID da categoria',
    example: 'uuid-categoria-alimentacao',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: 'integer',
    description:
      'Ano para resumo anual. Ignora startDate/endDate se informado.',
    example: 2024,
  })
  @ApiQuery({
    name: 'month',
    required: false,
    type: 'integer',
    description: 'Mês para resumo mensal (1-12). Requer year.',
    example: 9,
  })
  @ApiResponse({
    status: 200,
    description: 'Resumo financeiro retornado com sucesso',
    schema: {
      example: {
        totalIncome: 10000.5,
        totalExpense: 4500.75,
        balance: 5499.75,
        totalTransactions: 18,
        year: 2024,
        period: {
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-12-31T23:59:59.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'startDate must be a valid ISO 8601 date string',
          'year must not be less than 2000',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  async getFinancialSummary(
    @User() user: JwtPayload,
    @Query() filters: FinancialSummaryFilterDto,
  ) {
    return await this.transactionsService.getFinancialSummary(user, filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar transação por ID',
    description: 'Retorna uma transação específica do usuário autenticado',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único da transação',
    example: 'uuid-transacao',
  })
  @ApiResponse({
    status: 200,
    description: 'Transação encontrada',
    schema: {
      example: {
        id: 'uuid-transacao',
        name: 'Salário',
        description: 'Salário mensal',
        amount: 5000.0,
        type: 'income',
        categoryId: 'uuid-categoria-salario',
        transactionDate: '2023-12-01T00:00:00.000Z',
        userId: 'uuid-usuario',
        createdAt: '2023-12-01T00:00:00.000Z',
        updatedAt: '2023-12-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada',
  })
  async findOne(@User() user: JwtPayload, @Param('id') id: string) {
    return await this.transactionsService.findOne(user, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar transação',
    description:
      'Atualiza uma transação específica do usuário autenticado. Todos os campos são opcionais.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único da transação',
    example: 'uuid-transacao',
  })
  @ApiBody({
    type: UpdateTransactionDto,
    description: 'Dados para atualização da transação (todos opcionais)',
    examples: {
      updateName: {
        summary: 'Atualizar nome',
        value: {
          name: 'Novo nome da transação',
        },
      },
      updateAmount: {
        summary: 'Atualizar valor',
        value: {
          amount: 1500.0,
        },
      },
      updateType: {
        summary: 'Atualizar tipo',
        value: {
          type: 'income',
        },
      },
      complete: {
        summary: 'Atualização completa',
        value: {
          name: 'Freelance',
          description: 'Trabalho freelance',
          amount: 2000.0,
          type: 'income',
          categoryId: 'uuid-categoria-freelance',
          transactionDate: '2023-12-15T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Transação atualizada com sucesso',
    schema: {
      example: {
        id: 'uuid-transacao',
        name: 'Freelance',
        description: 'Trabalho freelance',
        amount: 2000.0,
        type: 'income',
        categoryId: 'uuid-categoria-freelance',
        transactionDate: '2023-12-15T00:00:00.000Z',
        userId: 'uuid-usuario',
        createdAt: '2023-12-01T00:00:00.000Z',
        updatedAt: '2023-12-15T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada',
  })
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
  @ApiOperation({
    summary: 'Deletar transação',
    description: 'Remove uma transação do usuário autenticado permanentemente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único da transação',
    example: 'uuid-transacao',
  })
  @ApiResponse({
    status: 204,
    description: 'Transação deletada com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada',
  })
  async remove(@User() user: JwtPayload, @Param('id') id: string) {
    return await this.transactionsService.remove(user, id);
  }
}
