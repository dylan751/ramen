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
      totalUncategorizedIncome,
      totalUncategorizedExpense,
      lastInvoices,
    ] = await Promise.all([
      this.invoiceRepository.countProjectInvoices(
        organizationId,
        projectId,
        search,
      ),
      this.budgetRepository.countProjectBudgets(organizationId, projectId),
      this.categoryRepository.countProjectCategories(organizationId, projectId),
      this.invoiceRepository.calculateProjectTotalIncome(
        organizationId,
        projectId,
        search,
      ),
      this.invoiceRepository.calculateProjectTotalExpense(
        organizationId,
        projectId,
        search,
      ),
      this.invoiceRepository.calculateProjectIncomesByMonth(
        organizationId,
        projectId,
        search,
      ),
      this.invoiceRepository.calculateProjectExpensesByMonth(
        organizationId,
        projectId,
        search,
      ),
      this.invoiceRepository.calculateProjectIncomesByCategory(
        organizationId,
        projectId,
        search,
      ),
      this.invoiceRepository.calculateProjectExpensesByCategory(
        organizationId,
        projectId,
        search,
      ),
      this.invoiceRepository.calculateProjectTotalUncategorizedIncome(
        organizationId,
        projectId,
        search,
      ),
      this.invoiceRepository.calculateProjectTotalUncategorizedExpense(
        organizationId,
        projectId,
        search,
      ),
      this.invoiceRepository.getProjectLastInvoices(
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
    projectStatistics.lastInvoices = lastInvoices;
    projectStatistics.totalUncategorizedIncome = totalUncategorizedIncome;
    projectStatistics.totalUncategorizedExpense = totalUncategorizedExpense;
    projectStatistics.balance =
      project.totalBudget + totalIncome - totalExpense;

    return projectStatistics;
  }
}
