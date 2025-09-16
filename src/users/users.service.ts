import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { validateUUID } from 'src/common/utils/validate-uuid.util';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/common/utils/password.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    try {
      const hashedPassword: string = await hashPassword(dto.password);

      const newUser = this.repository.create({
        ...dto,
        password: hashedPassword,
      });

      const savedUser = await this.repository.save(newUser);

      return UserResponseDto.fromEntity(savedUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email or Phone already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const data = await this.repository.find();

    return data.map((user) => UserResponseDto.fromEntity(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    validateUUID(id);

    const user = await this.repository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    return UserResponseDto.fromEntity(user);
  }

  async handleFindOne(id: string): Promise<User> {
    validateUUID(id);

    const user = await this.repository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      validateUUID(id);

      const user = await this.handleFindOne(id);

      this.repository.merge(user, dto);

      return this.repository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    validateUUID(id);

    const user = await this.handleFindOne(id);

    return this.repository.remove(user);
  }
}
