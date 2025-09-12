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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar nova categoria',
    description: 'Cria uma nova categoria para organizar transações',
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Dados para criação da categoria',
    examples: {
      alimentacao: {
        summary: 'Categoria Alimentação',
        value: {
          name: 'Alimentação',
          description: 'Gastos com comida e bebidas',
          userId: 'uuid-usuario',
        },
      },
      transporte: {
        summary: 'Categoria Transporte',
        value: {
          name: 'Transporte',
          description: 'Gastos com combustível, transporte público, etc.',
          userId: 'uuid-usuario',
        },
      },
      minimal: {
        summary: 'Categoria mínima',
        value: {
          name: 'Categoria simples',
          userId: 'uuid-usuario',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
    schema: {
      example: {
        id: 'uuid-categoria',
        name: 'Alimentação',
        description: 'Gastos com comida e bebidas',
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
        message: ['name should not be empty', 'name must be a string'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: 409,
    description: 'Categoria com este nome já existe para o usuário',
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as categorias',
    description:
      'Retorna uma lista com todas as categorias cadastradas no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
    schema: {
      example: [
        {
          id: 'uuid-categoria-1',
          name: 'Alimentação',
          description: 'Gastos com comida e bebidas',
          userId: 'uuid-usuario-1',
          createdAt: '2023-12-01T00:00:00.000Z',
          updatedAt: '2023-12-01T00:00:00.000Z',
        },
        {
          id: 'uuid-categoria-2',
          name: 'Transporte',
          description: 'Gastos com combustível, transporte público, etc.',
          userId: 'uuid-usuario-1',
          createdAt: '2023-12-01T00:00:00.000Z',
          updatedAt: '2023-12-01T00:00:00.000Z',
        },
        {
          id: 'uuid-categoria-3',
          name: 'Lazer',
          userId: 'uuid-usuario-2',
          createdAt: '2023-12-01T00:00:00.000Z',
          updatedAt: '2023-12-01T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  async findAll(): Promise<CategoryResponseDto[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar categoria por ID',
    description: 'Retorna uma categoria específica pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único da categoria',
    example: 'uuid-categoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada',
    schema: {
      example: {
        id: 'uuid-categoria',
        name: 'Alimentação',
        description: 'Gastos com comida e bebidas',
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
    description: 'Categoria não encontrada',
  })
  async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
    return await this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar categoria',
    description:
      'Atualiza uma categoria específica. Todos os campos são opcionais.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único da categoria',
    example: 'uuid-categoria',
  })
  @ApiBody({
    type: UpdateCategoryDto,
    description: 'Dados para atualização da categoria (todos opcionais)',
    examples: {
      updateName: {
        summary: 'Atualizar nome',
        value: {
          name: 'Novo nome da categoria',
        },
      },
      updateDescription: {
        summary: 'Atualizar descrição',
        value: {
          description: 'Nova descrição da categoria',
        },
      },
      complete: {
        summary: 'Atualização completa',
        value: {
          name: 'Alimentação e Bebidas',
          description: 'Gastos com alimentação, bebidas e restaurantes',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
    schema: {
      example: {
        id: 'uuid-categoria',
        name: 'Alimentação e Bebidas',
        description: 'Gastos com alimentação, bebidas e restaurantes',
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
    description: 'Categoria não encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'Categoria com este nome já existe para o usuário',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Deletar categoria',
    description:
      'Remove uma categoria permanentemente. Atenção: transações vinculadas a esta categoria podem ser afetadas.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único da categoria',
    example: 'uuid-categoria',
  })
  @ApiResponse({
    status: 204,
    description: 'Categoria deletada com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  @ApiResponse({
    status: 409,
    description:
      'Não é possível deletar categoria que possui transações vinculadas',
  })
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(id);
  }
}
