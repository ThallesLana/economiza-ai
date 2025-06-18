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
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto, @Res({passthrough: true}) res: Response) {
    const result = await this.authService.login(loginAuthDto, res);
    return result;
  }

  @Get('profile')
  profile(@Req() req: Request) {
    return this.authService.profile(req);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Patch(':id/update-password')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePassword: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(id, updatePassword);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.authService.remove(id);
  }
}
