import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword, verifyPassword } from '../common/utils/password.util';
import { isUUID } from 'class-validator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { validateUUID } from 'src/common/utils/validate-uuid.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(dto: CreateAuthDto) {
    const userExists = await this.repository.findOne({
      where: { email: dto.email },
    });

    if (userExists) throw new ConflictException('User already exists');

    const hashedPassword: string = await hashPassword(dto.password);

    const newUser = this.repository.create({
      ...dto,
      password: hashedPassword,
    });

    return this.repository.save(newUser);
  }

  async login(dto: LoginAuthDto, res: Response) {
    const { email, password } = dto;

    const user = await this.repository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new ConflictException('Invalid password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET ?? 'hi',
      { expiresIn: '1h' },
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 3600000, // 1 hour
    });

    return {
      message: 'Login successful',
    };
  }

  async handleFindOne(id: string): Promise<User> {
    if (!isUUID(id)) throw new NotFoundException('Invalid id');

    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    validateUUID(id);

    const user = await this.handleFindOne(id);

    const isCurrentPasswordValid = await verifyPassword(
      dto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid)
      throw new ConflictException('Current password is incorrect');

    if (dto.newPassword !== dto.confirmNewPassword)
      throw new ConflictException(
        'New password and confirm password do not match',
      );

    const hashedPassword: string = await hashPassword(dto.newPassword);

    user.password = hashedPassword;

    await this.repository.save(user);

    return {
      message: 'Password updated successfully',
    };
  }
}
