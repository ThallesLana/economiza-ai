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
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar novo usuário',
    description: 'Cria um novo usuário no sistema. Email é opcional.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Dados para criação do usuário',
    examples: {
      example1: {
        summary: 'Usuário completo',
        value: {
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '+5511999999999',
          password: 'senha123',
        },
      },
      example2: {
        summary: 'Usuário sem email',
        value: {
          name: 'Maria Santos',
          phone: '+5511888888888',
          password: 'senha456',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: {
      example: {
        id: 'uuid-string',
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '+5511999999999',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
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
          'email must be an email',
          'password must be longer than or equal to 6 characters',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email ou telefone já cadastrado',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os usuários',
    description: 'Retorna uma lista com todos os usuários cadastrados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    schema: {
      example: [
        {
          id: 'uuid-string-1',
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '+5511999999999',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: 'uuid-string-2',
          name: 'Maria Santos',
          phone: '+5511888888888',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna os dados de um usuário específico pelo ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único do usuário',
    example: 'uuid-string',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    schema: {
      example: {
        id: 'uuid-string',
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '+5511999999999',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar usuário',
    description:
      'Atualiza os dados de um usuário específico. Todos os campos são opcionais.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único do usuário',
    example: 'uuid-string',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Dados para atualização do usuário (todos opcionais)',
    examples: {
      example1: {
        summary: 'Atualizar nome',
        value: {
          name: 'João Silva Santos',
        },
      },
      example2: {
        summary: 'Atualizar email',
        value: {
          email: 'novo.email@email.com',
        },
      },
      example3: {
        summary: 'Atualizar nome e email',
        value: {
          name: 'João Silva Santos',
          email: 'novo.email@email.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    schema: {
      example: {
        id: 'uuid-string',
        name: 'João Silva Santos',
        email: 'novo.email@email.com',
        phone: '+5511999999999',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T12:00:00.000Z',
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
    description: 'Usuário não encontrado',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deletar usuário',
    description: 'Remove um usuário do sistema permanentemente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único do usuário',
    example: 'uuid-string',
  })
  @ApiResponse({
    status: 204,
    description: 'Usuário deletado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }
}
