import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/categories.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { AuthService } from 'src/auth/auth.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
    private authService: AuthService,
  ) {}

  async create(dto: CreateCategoryDto) {
    const categoryExists = await this.repository.findOne({
      where: { name: dto.name },
    });

    if (categoryExists) throw new ConflictException('Category already exists');

    if (!isUUID(dto.userId)) throw new BadRequestException('Invalid user id');

    const userExists = await this.authService.findOne(dto.userId);

    if (!userExists) throw new NotFoundException('User not found');

    const newCategory = this.repository.create({
      ...dto,
    });

    return this.repository.save(newCategory);
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const data = await this.repository.find();

    return data.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      userId: category.userId,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));
  }

  async findOne(id: string): Promise<CategoryResponseDto> {
    if (!isUUID(id)) throw new NotFoundException('Invalid id');

    const category = await this.repository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    if (!isUUID(id)) throw new NotFoundException('Invalid id');

    const category = await this.repository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    this.repository.merge(category, dto);

    return this.repository.save(category);
  }

  async remove(id: string) {
    if (!isUUID(id)) throw new NotFoundException('Invalid id');

    const category = await this.repository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.repository.remove(category);
  }
}
