import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { validateUUID } from 'src/common/utils/validate-uuid.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

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
    validateUUID(id);

    const user = await this.repository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async handleFindOne(id: string): Promise<User> {
    validateUUID(id);

    const user = await this.repository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    validateUUID(id);

    const user = await this.handleFindOne(id);

    this.repository.merge(user, dto);

    return this.repository.save(user);
  }

  async remove(id: string) {
    validateUUID(id);

    const user = await this.handleFindOne(id);

    return this.repository.remove(user);
  }
}
