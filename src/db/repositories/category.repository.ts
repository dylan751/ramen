import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Category } from 'src/db/entities';
import { CategorySearchRequestDto } from 'src/modules/organizations/projects/categories/dto/category-search-request.dto';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async findCategoriesForOrganizationAndProject(
    organizationId: number,
    projectId: number,
    search: CategorySearchRequestDto,
  ): Promise<Category[]> {
    const query = this.createQueryBuilder('category')
      .where('category.organizationId = :organizationId', { organizationId })
      .andWhere('category.projectId = :projectId', { projectId });

    const allCategories = await query.getMany();

    let filteredCategories = allCategories;

    if (search.query) {
      const queryLowered = search.query.toLowerCase();
      filteredCategories = allCategories.filter((category) =>
        category.name.toLowerCase().includes(queryLowered),
      );
    }

    if (search.type) {
      filteredCategories = filteredCategories.filter(
        (category) => category.type === search.type,
      );
    }

    return filteredCategories;
  }

  async findCategoryForOrganizationAndProject(
    organizationId: number,
    projectId: number,
    id: number,
  ): Promise<Category> {
    return await this.createQueryBuilder('category')
      .where('category.organizationId = :organizationId', { organizationId })
      .andWhere('category.projectId = :projectId', { projectId })
      .andWhere('category.id = :id', { id })
      .getOne();
  }
}