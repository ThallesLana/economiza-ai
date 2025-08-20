import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Response } from 'express';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/common/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginAuthDto, res);
    return result;
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  profile(@User() user: JwtPayload) {
    return this.authService.profile(user);
  }

  @Get()
  @UseGuards(JwtGuard)
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Patch(':id/update-password')
  @UseGuards(JwtGuard)
  updatePassword(
    @Param('id') id: string,
    @Body() updatePassword: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(id, updatePassword);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtGuard)
  async remove(@Param('id') id: string) {
    await this.authService.remove(id);
  }
}
