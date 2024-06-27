import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryRequestDto } from './dto/create-category-request.dto';
import { UpdateCategoryRequestDto } from './dto/update-category-request.dto';
import { CategoryRepository } from 'src/db/repositories';
import { Category } from 'src/db/entities';
import {
  CategoryResponseListDto,
  CategoryResponseDto,
} from './dto/category-response.dto';
import { CategorySearchRequestDto } from './dto/category-search-request.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(
    organizationId: number,
    projectId: number,
    request: CreateCategoryRequestDto,
  ): Promise<Category> {
    const { name, color, icon, type } = request;

    // Validate unique category name
    const existedCategory = await this.categoryRepository.findByNameForProject(
      name,
      projectId,
    );
    if (existedCategory) {
      throw new BadRequestException(
        'A category with that name already exists!',
      );
    }

    // Create category
    const category = new Category();
    category.organizationId = organizationId;
    category.projectId = projectId;
    category.name = name;
    category.color = color;
    category.icon = icon;
    category.type = type;

    await this.categoryRepository.manager.transaction(async (manager) => {
      await manager.save(Category, category);
    });

    return category;
  }

  async findAll(
    organizationId: number,
    projectId: number,
    search: CategorySearchRequestDto,
  ): Promise<CategoryResponseListDto> {
    const categories =
      await this.categoryRepository.findCategoriesForOrganizationAndProject(
        organizationId,
        projectId,
        search,
      );

    const categoryDtos = categories.map(
      (category) => new CategoryResponseDto(category),
    );

    const result = new CategoryResponseListDto();
    result.categories = categoryDtos;
    result.metadata = {
      total: categoryDtos.length,
      params: search,
    };

    return result;
  }

  async findOne(
    organizationId: number,
    projectId: number,
    categoryId: number,
  ): Promise<Category> {
    const category =
      await this.categoryRepository.findCategoryForOrganizationAndProject(
        organizationId,
        projectId,
        categoryId,
      );
    if (!category) {
      throw new NotFoundException(
        `Category ${categoryId} does not belong to the organization ${organizationId}, project ${projectId}`,
      );
    }

    return category;
  }

  async update(
    organizationId: number,
    projectId: number,
    categoryId: number,
    req: UpdateCategoryRequestDto,
  ) {
    const { name, color, icon, type } = req;
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, projectId, organizationId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category ${categoryId} does not belong to the organization ${organizationId}, project ${projectId}`,
      );
    }

    if (name) category.name = name;
    if (color) category.color = color;
    if (icon) category.icon = icon;
    if (type) category.type = type;
    await this.categoryRepository.manager.transaction(async (manager) => {
      await manager.save(Category, category);
    });

    return category;
  }

  async delete(
    organizationId: number,
    projectId: number,
    categoryId: number,
  ): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, projectId, organizationId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category ${categoryId} doesn't belong to organization ${organizationId}, project ${projectId}`,
      );
    }

    await this.categoryRepository.manager.transaction(async (manager) => {
      const deletePromises = [];

      deletePromises.push(manager.delete(Category, { id: categoryId }));

      await Promise.all(deletePromises);
    });
  }
}
