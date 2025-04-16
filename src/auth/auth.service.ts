import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from '../utils/password.util';
import { isUUID } from 'class-validator';

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

  findAll() {
    return this.repository.find();
  }

  async findOne(id: string) {
    if (!isUUID(id)) throw new NotFoundException('Invalid id');

    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // update method to don't update password
  async update(id: string, dto: UpdateAuthDto) {
    const user = await this.findOne(id);

    this.repository.merge(user, dto);

    return this.repository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    return this.repository.remove(user);
  }
}
