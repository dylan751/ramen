import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Budget } from 'src/db/entities';
import { BudgetSearchRequestDto } from 'src/modules/organizations/projects/budgets/dto/budget-search-request.dto';

@Injectable()
export class BudgetRepository extends Repository<Budget> {
  constructor(private dataSource: DataSource) {
    super(Budget, dataSource.createEntityManager());
  }

  async findBudgetsForOrganizationAndProject(
    organizationId: number,
    projectId: number,
    search: BudgetSearchRequestDto,
  ): Promise<Budget[]> {
    const query = this.createQueryBuilder('budget')
      .leftJoinAndSelect('budget.category', 'category')
      .leftJoinAndSelect('category.invoices', 'invoices')
      .where('budget.organizationId = :organizationId', { organizationId })
      .andWhere('budget.projectId = :projectId', { projectId });

    if (search.categoryId) {
      query.andWhere('budget.categoryId = :categoryId', {
        categoryId: search.categoryId,
      });
    }

    const allBudgets = await query.getMany();

    let filteredBudgets = allBudgets;

    if (search.fromAmount) {
      filteredBudgets = filteredBudgets.filter(
        (budget) => budget.amount >= search.fromAmount,
      );
    }

    if (search.toAmount) {
      filteredBudgets = filteredBudgets.filter(
        (budget) => budget.amount <= search.toAmount,
      );
    }

    return filteredBudgets;
  }

  async findBudgetForOrganizationAndProject(
    organizationId: number,
    projectId: number,
    id: number,
  ): Promise<Budget> {
    return await this.createQueryBuilder('budget')
      .leftJoinAndSelect('budget.category', 'category')
      .leftJoinAndSelect('category.invoices', 'invoices')
      .where('budget.organizationId = :organizationId', { organizationId })
      .andWhere('budget.projectId = :projectId', { projectId })
      .andWhere('budget.id = :id', { id })
      .getOne();
  }

  async findBudgetByCategoryId(
    organizationId: number,
    projectId: number,
    categoryId: number,
  ): Promise<Budget> {
    return await this.createQueryBuilder('budget')
      .where('budget.organizationId = :organizationId', { organizationId })
      .andWhere('budget.projectId = :projectId', { projectId })
      .andWhere('budget.categoryId = :categoryId', { categoryId })
      .getOne();
  }

  async countBudgets(
    organizationId: number,
    projectId: number,
  ): Promise<number> {
    return this.count({
      where: {
        organizationId,
        projectId,
      },
    });
  }
}
