import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword, verifyPassword } from '../utils/password.util';
import { isUUID } from 'class-validator';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly repository: Repository<Auth>,
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

  async findAll(): Promise<UserResponseDto[]> {
    const data = await this.repository.find();

    return data.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    if (!isUUID(id)) throw new NotFoundException('Invalid id');

    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async handleFindOne(id: string): Promise<Auth> {
    if (!isUUID(id)) throw new NotFoundException('Invalid id');

    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateAuthDto) {
    const user = await this.handleFindOne(id);

    const { password, ...updateData } = dto;

    this.repository.merge(user, updateData);

    return this.repository.save(user);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = await this.handleFindOne(id);

    const isCurrentPasswordValid = await verifyPassword(
      dto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new ConflictException('Current password is incorrect');
    }

    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new ConflictException(
        'New password and confirm password do not match',
      );
    }

    const hashedPassword: string = await hashPassword(dto.newPassword);

    user.password = hashedPassword;

    await this.repository.save(user);

    return {
      message: 'Password updated successfully',
    };
  }

  async remove(id: string) {
    const user = await this.handleFindOne(id);

    return this.repository.remove(user);
  }
}
