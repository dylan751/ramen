import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBudgetRequestDto } from './dto/create-budget-request.dto';
import { UpdateBudgetRequestDto } from './dto/update-budget-request.dto';
import { BudgetRepository } from 'src/db/repositories/budget.repository';
import { Budget } from 'src/db/entities';
import {
  BudgetResponseListDto,
  BudgetResponseDto,
} from './dto/budget-response.dto';
import { BudgetSearchRequestDto } from './dto/budget-search-request.dto';

@Injectable()
export class BudgetsService {
  constructor(private readonly budgetRepository: BudgetRepository) {}

  async create(
    organizationId: number,
    projectId: number,
    request: CreateBudgetRequestDto,
  ): Promise<Budget> {
    const { categoryId, amount } = request;

    // Create budget
    const budget = new Budget();
    budget.organizationId = organizationId;
    budget.projectId = projectId;
    budget.categoryId = categoryId;
    budget.amount = amount;

    await this.budgetRepository.manager.transaction(async (manager) => {
      await manager.save(Budget, budget);
    });

    return budget;
  }

  async findAll(
    organizationId: number,
    projectId: number,
    search: BudgetSearchRequestDto,
  ): Promise<BudgetResponseListDto> {
    const budgets =
      await this.budgetRepository.findBudgetsForOrganizationAndProject(
        organizationId,
        projectId,
        search,
      );

    const budgetDtos = budgets.map((budget) => new BudgetResponseDto(budget));

    const result = new BudgetResponseListDto();
    result.budgets = budgetDtos;
    result.metadata = {
      total: budgetDtos.length,
      params: search,
    };

    return result;
  }

  async findOne(
    organizationId: number,
    projectId: number,
    budgetId: number,
  ): Promise<Budget> {
    const budget =
      await this.budgetRepository.findBudgetForOrganizationAndProject(
        organizationId,
        projectId,
        budgetId,
      );
    if (!budget) {
      throw new NotFoundException(
        `Budget ${budgetId} does not belong to the organization ${organizationId}, budget ${projectId}`,
      );
    }

    return budget;
  }

  async update(
    organizationId: number,
    projectId: number,
    budgetId: number,
    req: UpdateBudgetRequestDto,
  ) {
    const { amount } = req;
    const budget = await this.budgetRepository.findOne({
      where: { id: budgetId, projectId, organizationId },
    });

    if (!budget) {
      throw new NotFoundException(
        `Budget ${budgetId} does not belong to the organization ${organizationId}, budget ${projectId}`,
      );
    }

    if (amount) budget.amount = amount;
    await this.budgetRepository.manager.transaction(async (manager) => {
      await manager.save(Budget, budget);
    });

    return budget;
  }

  async delete(
    organizationId: number,
    projectId: number,
    budgetId: number,
  ): Promise<void> {
    const budget = await this.budgetRepository.findOne({
      where: { id: budgetId, projectId, organizationId },
    });

    if (!budget) {
      throw new NotFoundException(
        `Budget ${budgetId} doesn't belong to organization ${organizationId}, project ${projectId}`,
      );
    }

    await this.budgetRepository.manager.transaction(async (manager) => {
      const deletePromises = [];

      deletePromises.push(manager.delete(Budget, { id: budgetId }));

      await Promise.all(deletePromises);
    });
  }
}
