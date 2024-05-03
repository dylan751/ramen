import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BudgetRepository,
  CategoryRepository,
  InvoiceRepository,
  ProjectRepository,
} from 'src/db/repositories';
import { ProjectStatisticsResponseDto } from './dto/project-statistics-response.dto';
import { ProjectStatisticsSearchRequestDto } from './dto/project-statistics-search-request.dto';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly budgetRepository: BudgetRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async getStatistics(
    organizationId: number,
    projectId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<ProjectStatisticsResponseDto> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, organizationId },
    });

    if (!project) {
      throw new NotFoundException(
        `Project ${projectId} doesn't belong to organization ${organizationId}`,
      );
    }

    const [
      invoiceCount,
      budgetCount,
      categoryCount,
      totalIncome,
      totalExpense,
      incomesByMonth,
      expensesByMonth,
      incomesByCategory,
      expensesByCategory,
    ] = await Promise.all([
      this.invoiceRepository.countInvoices(organizationId, projectId, search),
      this.budgetRepository.countBudgets(organizationId, projectId),
      this.categoryRepository.countCategories(organizationId, projectId),
      this.invoiceRepository.calculateTotalIncome(
        organizationId,
        projectId,
        search,
      ),
      this.invoiceRepository.calculateTotalExpense(
        organizationId,
        projectId,
        search,
      ),
      this.invoiceRepository.calculateIncomesByMonth(
        organizationId,
        projectId,
        search,
      ),
      this.invoiceRepository.calculateExpensesByMonth(
        organizationId,
        projectId,
        search,
      ),
      this.invoiceRepository.calculateIncomesByCategory(
        organizationId,
        projectId,
        search,
      ),
      this.invoiceRepository.calculateExpensesByCategory(
        organizationId,
        projectId,
        search,
      ),
    ]);

    const projectStatistics = new ProjectStatisticsResponseDto();
    projectStatistics.id = project.id;
    projectStatistics.name = project.name;
    projectStatistics.created = project.createdAt;
    projectStatistics.invoiceCount = invoiceCount;
    projectStatistics.budgetCount = budgetCount;
    projectStatistics.categoryCount = categoryCount;
    projectStatistics.totalIncome = totalIncome;
    projectStatistics.totalExpense = totalExpense;
    projectStatistics.incomesByMonth = incomesByMonth;
    projectStatistics.expensesByMonth = expensesByMonth;
    projectStatistics.incomesByCategory = incomesByCategory;
    projectStatistics.expensesByCategory = expensesByCategory;
    projectStatistics.balance = totalIncome - totalExpense;

    return projectStatistics;
  }
}
