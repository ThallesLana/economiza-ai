import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Response } from 'express';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Fazer login',
    description: 'Autentica um usuário e retorna um token JWT via cookie',
  })
  @ApiBody({
    type: LoginAuthDto,
    description: 'Credenciais de login do usuário',
    examples: {
      validLogin: {
        summary: 'Login válido',
        value: {
          email: 'usuario@email.com',
          password: 'senha123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      example: {
        user: {
          id: 'uuid-usuario',
          name: 'João Silva',
          email: 'usuario@email.com',
          phone: '+5511999999999',
          createdAt: '2023-12-01T00:00:00.000Z',
          updatedAt: '2023-12-01T00:00:00.000Z',
        },
        message: 'Login successful',
      },
    },
    headers: {
      'Set-Cookie': {
        description: 'Cookie JWT para autenticação',
        schema: {
          type: 'string',
          example:
            'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Path=/; Max-Age=86400',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email', 'password should not be empty'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginAuthDto, res);
    return result;
  }

  @Patch(':id/update-password')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar senha',
    description:
      'Permite que um usuário autenticado altere sua senha fornecendo a senha atual e a nova senha',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único do usuário',
    example: 'uuid-usuario',
  })
  @ApiBody({
    type: UpdatePasswordDto,
    description: 'Dados para atualização da senha',
    examples: {
      passwordUpdate: {
        summary: 'Atualização de senha',
        value: {
          currentPassword: 'senhaAtual123',
          newPassword: 'novaSenha456',
          confirmNewPassword: 'novaSenha456',
        },
      },
      strongPassword: {
        summary: 'Senha forte',
        value: {
          currentPassword: 'senhaAtual123',
          newPassword: 'MinhaNovaSenh@2024!',
          confirmNewPassword: 'MinhaNovaSenh@2024!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Senha atualizada com sucesso',
    schema: {
      example: {
        message: 'Password updated successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou senhas não coincidem',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'newPassword must be longer than or equal to 6 characters',
          'Passwords do not match',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou senha atual incorreta',
    schema: {
      example: {
        statusCode: 401,
        message: 'Current password is incorrect',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  updatePassword(
    @Param('id') id: string,
    @Body() updatePassword: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(id, updatePassword);
  }
}
