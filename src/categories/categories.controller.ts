import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';

@Controller('categories')
@UseGuards(JwtGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<CategoryResponseDto[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
    return await this.categoriesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(id);
  }
}
