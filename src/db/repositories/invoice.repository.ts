import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Invoice, InvoiceStatus, InvoiceType } from 'src/db/entities';
import { InvoiceSearchRequestDto } from 'src/modules/organizations/invoices/dto/invoice-search-request.dto';
import { getMonth, getYear, isAfter, isBefore, isEqual } from 'date-fns';
import { ProjectStatisticsSearchRequestDto } from 'src/modules/organizations/projects/statistics/dto/project-statistics-search-request.dto';
import { IncomesAndExpensesByCategoryResponseDto } from 'src/modules/organizations/projects/statistics/dto/project-statistics-response.dto';
import { InvoiceResponseDto } from 'src/modules/organizations/invoices/dto/invoice-response.dto';
import { OrganizationStatisticsSearchRequestDto } from 'src/modules/organizations/statistics/dto/organization-statistics-search-request.dto';
import { ProjectRepository } from './project.repository';

@Injectable()
export class InvoiceRepository extends Repository<Invoice> {
  constructor(
    private dataSource: DataSource,
    private readonly projectRepository: ProjectRepository,
  ) {
    super(Invoice, dataSource.createEntityManager());
  }

  async findByUserIdAndOrganizationId(
    userId: number,
    organizationId: number,
  ): Promise<Invoice[]> {
    return await this.createQueryBuilder('invoice')
      .innerJoin('invoice.userOrganizationInvoices', 'userOrganizationInvoices')
      .innerJoin(
        'userOrganizationInvoices.userOrganization',
        'userOrganization',
      )
      .innerJoin('userOrganization.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('userOrganizationInvoices.organizationId = :organizationId', {
        organizationId,
      })
      .getMany();
  }

  async findInvoicesForOrganization(
    organizationId: number,
    search: InvoiceSearchRequestDto,
  ): Promise<Invoice[]> {
    const query = await this.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.project', 'project')
      .leftJoinAndSelect('invoice.category', 'category')
      .leftJoinAndSelect('invoice.items', 'items')
      .leftJoinAndSelect(
        'invoice.userOrganizationInvoices',
        'userOrganizationInvoices',
      )
      .leftJoinAndSelect(
        'userOrganizationInvoices.userOrganization',
        'userOrganization',
      )
      .leftJoinAndSelect('userOrganization.user', 'user')
      .leftJoinAndSelect('userOrganization.roles', 'roles')
      .where('invoice.organizationId = :organizationId', { organizationId });

    if (search.projectId) {
      query.andWhere('invoice.projectId = :projectId', {
        projectId: search.projectId,
      });
    }

    if (search.categoryId) {
      query.andWhere('invoice.categoryId = :categoryId', {
        categoryId: search.categoryId,
      });
    }

    if (search.uid) {
      query.andWhere('invoice.uid LIKE :uid', {
        uid: `%${search.uid}%`,
      });
    }

    if (search.type) {
      query.andWhere('invoice.type = :type', {
        type: search.type,
      });
    }

    if (search.status) {
      switch (search.status) {
        case InvoiceStatus.CATEGORIZED: {
          query.andWhere('invoice.categoryId IS NOT NULL');
          break;
        }
        case InvoiceStatus.UNCATEGORIZED: {
          query.andWhere('invoice.categoryId IS NULL');
          break;
        }
      }
    }

    const allInvoices = await query.getMany();

    let filteredInvoices = allInvoices;

    if (search.fromDate) {
      filteredInvoices = filteredInvoices.filter(
        (invoice) =>
          isAfter(invoice.date, new Date(search.fromDate)) ||
          isEqual(invoice.date, new Date(search.fromDate)),
      );
    }

    if (search.toDate) {
      filteredInvoices = filteredInvoices.filter(
        (invoice) =>
          isBefore(invoice.date, new Date(search.toDate)) ||
          isEqual(invoice.date, new Date(search.toDate)),
      );
    }

    return filteredInvoices;
  }

  async findInvoicesForProjectOfOrganization(
    organizationId: number,
    projectId: number,
    search: InvoiceSearchRequestDto,
  ): Promise<Invoice[]> {
    const query = await this.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.project', 'project')
      .leftJoinAndSelect('invoice.category', 'category')
      .leftJoinAndSelect('invoice.items', 'items')
      .leftJoinAndSelect(
        'invoice.userOrganizationInvoices',
        'userOrganizationInvoices',
      )
      .leftJoinAndSelect(
        'userOrganizationInvoices.userOrganization',
        'userOrganization',
      )
      .leftJoinAndSelect('userOrganization.user', 'user')
      .leftJoinAndSelect('userOrganization.roles', 'roles')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .andWhere('invoice.projectId = :projectId', { projectId });

    if (search.categoryId) {
      query.andWhere('invoice.categoryId = :categoryId', {
        categoryId: search.categoryId,
      });
    }

    if (search.uid) {
      query.andWhere('invoice.uid LIKE :uid', {
        uid: `%${search.uid}%`,
      });
    }

    if (search.type) {
      query.andWhere('invoice.type = :type', {
        type: search.type,
      });
    }

    if (search.status) {
      switch (search.status) {
        case InvoiceStatus.CATEGORIZED: {
          query.andWhere('invoice.categoryId IS NOT NULL');
          break;
        }
        case InvoiceStatus.UNCATEGORIZED: {
          query.andWhere('invoice.categoryId IS NULL');
          break;
        }
      }
    }

    const allInvoices = await query.getMany();

    let filteredInvoices = allInvoices;

    if (search.fromDate) {
      filteredInvoices = filteredInvoices.filter(
        (invoice) =>
          isAfter(invoice.date, new Date(search.fromDate)) ||
          isEqual(invoice.date, new Date(search.fromDate)),
      );
    }

    if (search.toDate) {
      filteredInvoices = filteredInvoices.filter(
        (invoice) =>
          isBefore(invoice.date, new Date(search.toDate)) ||
          isEqual(invoice.date, new Date(search.toDate)),
      );
    }

    return filteredInvoices;
  }

  async findInvoiceForOrganization(
    organizationId: number,
    id: number,
  ): Promise<Invoice> {
    return await this.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.project', 'project')
      .leftJoinAndSelect('invoice.category', 'category')
      .leftJoinAndSelect('invoice.items', 'items')
      .leftJoinAndSelect(
        'invoice.userOrganizationInvoices',
        'userOrganizationInvoices',
      )
      .leftJoinAndSelect(
        'userOrganizationInvoices.userOrganization',
        'userOrganization',
      )
      .leftJoinAndSelect('userOrganization.user', 'user')
      .leftJoinAndSelect('userOrganization.roles', 'roles')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .andWhere('invoice.id = :id', { id })
      .getOne();
  }

  async countProjectInvoices(
    organizationId: number,
    projectId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<number> {
    const invoicesCountQuery = await this.createQueryBuilder('invoice')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .andWhere('invoice.projectId = :projectId', { projectId });

    if (search.date) {
      const year = getYear(search.date);
      invoicesCountQuery.andWhere('YEAR(invoice.date) = :year', { year });
    }

    const invoicesCount = await invoicesCountQuery.getCount();
    return invoicesCount;
  }

  async calculateProjectTotalIncome(
    organizationId: number,
    projectId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<number> {
    const totalInvoiceValueQuery = await this.createQueryBuilder('invoice')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .andWhere('invoice.projectId = :projectId', { projectId })
      .andWhere('invoice.type = :type', { type: InvoiceType.INCOME });

    const totalProjectValueQuery = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.id = :projectId', { projectId });

    if (search.date) {
      const year = getYear(search.date);
      totalInvoiceValueQuery.andWhere('YEAR(invoice.date) = :year', { year });
      totalProjectValueQuery.andWhere('YEAR(project.startDate) = :year', {
        year,
      });
    }

    const totalInvoiceValue = await totalInvoiceValueQuery
      .select('SUM(invoice.total / invoice.exchangeRate)', 'invoiceTotal')
      .getRawOne();

    const totalProjectValue = await totalProjectValueQuery
      .select('SUM(project.totalBudget)', 'projectTotal')
      .getRawOne();

    return (
      parseFloat(totalInvoiceValue.invoiceTotal ?? 0) +
      parseFloat(totalProjectValue.projectTotal ?? 0)
    );
  }

  async calculateProjectTotalExpense(
    organizationId: number,
    projectId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<number> {
    const totalInvoiceValueQuery = await this.createQueryBuilder('invoice')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .andWhere('invoice.projectId = :projectId', { projectId })
      .andWhere('invoice.type = :type', { type: InvoiceType.EXPENSE });

    if (search.date) {
      const year = getYear(search.date);
      totalInvoiceValueQuery.andWhere('YEAR(invoice.date) = :year', { year });
    }

    const totalInvoiceValue = await totalInvoiceValueQuery
      .select('SUM(invoice.total / invoice.exchangeRate)', 'total')
      .getRawOne();

    return parseFloat(totalInvoiceValue.total ?? 0);
  }

  async calculateProjectIncomesByMonth(
    organizationId: number,
    projectId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<number[]> {
    const incomesByMonth: number[] = [];

    const totalProjectIncomeQuery = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.id = :projectId', { projectId });

    for (let month = 1; month <= 12; month++) {
      const totalIncomeQuery = await this.createQueryBuilder('invoice')
        .select('SUM(invoice.total / invoice.exchangeRate)', 'total')
        .where('invoice.organizationId = :organizationId', { organizationId })
        .andWhere('invoice.projectId = :projectId', { projectId })
        .andWhere('invoice.type = :type', { type: InvoiceType.INCOME })
        .andWhere('MONTH(invoice.date) = :month', { month });

      if (search.date) {
        const year = getYear(search.date);
        totalIncomeQuery.andWhere('YEAR(invoice.date) = :year', { year });
        totalProjectIncomeQuery.andWhere('YEAR(project.startDate) = :year', {
          year,
        });
      }

      const totalIncome = await totalIncomeQuery.getRawOne();

      incomesByMonth.push(parseFloat(totalIncome.total) || 0);
    }

    // ---------------------------------------------------------------
    const totalProjectIncome = await totalProjectIncomeQuery.getOne();

    // Total income = Total invoice income + total project budget
    const projectStartMonth = getMonth(totalProjectIncome.startDate);
    incomesByMonth[projectStartMonth] += totalProjectIncome.totalBudget;

    return incomesByMonth;
  }

  async calculateProjectExpensesByMonth(
    organizationId: number,
    projectId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<number[]> {
    const expensesByMonth: number[] = [];

    for (let month = 1; month <= 12; month++) {
      const totalExpenseQuery = await this.createQueryBuilder('invoice')
        .select('SUM(invoice.total / invoice.exchangeRate)', 'total')
        .where('invoice.organizationId = :organizationId', { organizationId })
        .andWhere('invoice.projectId = :projectId', { projectId })
        .andWhere('invoice.type = :type', { type: InvoiceType.EXPENSE })
        .andWhere('MONTH(invoice.date) = :month', { month });

      if (search.date) {
        const year = getYear(search.date);
        totalExpenseQuery.andWhere('YEAR(invoice.date) = :year', { year });
      }

      const totalExpense = await totalExpenseQuery.getRawOne();

      expensesByMonth.push(parseFloat(totalExpense.total) || 0);
    }

    return expensesByMonth;
  }

  async calculateProjectIncomesByCategory(
    organizationId: number,
    projectId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<IncomesAndExpensesByCategoryResponseDto[]> {
    const incomesQuery = await this.createQueryBuilder('invoice')
      .select('SUM(invoice.total / invoice.exchangeRate)', 'total')
      .leftJoinAndSelect('invoice.category', 'category')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .andWhere('invoice.projectId = :projectId', { projectId })
      .andWhere('invoice.type = :type', { type: InvoiceType.INCOME })
      .andWhere('invoice.categoryId IS NOT NULL');

    if (search.date) {
      const year = getYear(search.date);
      incomesQuery.andWhere('YEAR(invoice.date) = :year', { year });
    }

    const incomes = await incomesQuery
      .groupBy('invoice.categoryId')
      .getRawMany();

    // Format data response
    const incomeArray: IncomesAndExpensesByCategoryResponseDto[] = [];
    incomes.forEach((income) => {
      incomeArray.push({
        name: income.category_name,
        color: income.category_color,
        total: parseFloat(income.total),
      });
    });
    return incomeArray;
  }

  async calculateProjectExpensesByCategory(
    organizationId: number,
    projectId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<IncomesAndExpensesByCategoryResponseDto[]> {
    const expensesQuery = await this.createQueryBuilder('invoice')
      .select('SUM(invoice.total / invoice.exchangeRate)', 'total')
      .leftJoinAndSelect('invoice.category', 'category')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .andWhere('invoice.projectId = :projectId', { projectId })
      .andWhere('invoice.type = :type', { type: InvoiceType.EXPENSE })
      .andWhere('invoice.categoryId IS NOT NULL');

    if (search.date) {
      const year = getYear(search.date);
      expensesQuery.andWhere('YEAR(invoice.date) = :year', { year });
    }

    const expenses = await expensesQuery
      .groupBy('invoice.categoryId')
      .getRawMany();

    // Format data response
    const expenseArray: IncomesAndExpensesByCategoryResponseDto[] = [];
    expenses.forEach((expense) => {
      expenseArray.push({
        name: expense.category_name,
        color: expense.category_color,
        total: parseFloat(expense.total),
      });
    });
    return expenseArray;
  }

  async calculateProjectTotalUncategorizedIncome(
    organizationId: number,
    projectId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<number> {
    const totalInvoiceValueQuery = await this.createQueryBuilder('invoice')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .andWhere('invoice.projectId = :projectId', { projectId })
      .andWhere('invoice.type = :type', { type: InvoiceType.INCOME })
      .andWhere('invoice.categoryId IS NULL');

    if (search.date) {
      const year = getYear(search.date);
      totalInvoiceValueQuery.andWhere('YEAR(invoice.date) = :year', { year });
    }

    const totalInvoiceValue = await totalInvoiceValueQuery
      .select('SUM(invoice.total / invoice.exchangeRate)', 'total')
      .getRawOne();

    return parseFloat(totalInvoiceValue.total ?? 0);
  }

  async calculateProjectTotalUncategorizedExpense(
    organizationId: number,
    projectId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<number> {
    const totalInvoiceValueQuery = await this.createQueryBuilder('invoice')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .andWhere('invoice.projectId = :projectId', { projectId })
      .andWhere('invoice.type = :type', { type: InvoiceType.EXPENSE })
      .andWhere('invoice.categoryId IS NULL');

    if (search.date) {
      const year = getYear(search.date);
      totalInvoiceValueQuery.andWhere('YEAR(invoice.date) = :year', { year });
    }

    const totalInvoiceValue = await totalInvoiceValueQuery
      .select('SUM(invoice.total / invoice.exchangeRate)', 'total')
      .getRawOne();

    return parseFloat(totalInvoiceValue.total ?? 0);
  }

  async getProjectLastInvoices(
    organizationId: number,
    projectId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<InvoiceResponseDto[]> {
    const query = await this.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.project', 'project')
      .leftJoinAndSelect('invoice.category', 'category')
      .leftJoinAndSelect('invoice.items', 'items')
      .leftJoinAndSelect(
        'invoice.userOrganizationInvoices',
        'userOrganizationInvoices',
      )
      .leftJoinAndSelect(
        'userOrganizationInvoices.userOrganization',
        'userOrganization',
      )
      .leftJoinAndSelect('userOrganization.user', 'user')
      .leftJoinAndSelect('userOrganization.roles', 'roles')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .andWhere('invoice.projectId = :projectId', { projectId });

    if (search.date) {
      const year = getYear(search.date);
      query.andWhere('YEAR(invoice.date) = :year', { year });
    }

    const lastInvoices = await query
      .orderBy('invoice.createdAt', 'DESC')
      .take(5)
      .getMany();

    return lastInvoices.map((invoice) => new InvoiceResponseDto(invoice));
  }

  async countOrgInvoices(
    organizationId: number,
    search: OrganizationStatisticsSearchRequestDto,
  ): Promise<number> {
    const invoicesCountQuery = await this.createQueryBuilder('invoice').where(
      'invoice.organizationId = :organizationId',
      { organizationId },
    );

    if (search.date) {
      const year = getYear(search.date);
      invoicesCountQuery.andWhere('YEAR(invoice.date) = :year', { year });
    }

    const invoicesCount = await invoicesCountQuery.getCount();
    return invoicesCount;
  }

  async calculateOrgTotalIncome(
    organizationId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<number> {
    const totalInvoiceValueQuery = await this.createQueryBuilder('invoice')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .andWhere('invoice.type = :type', { type: InvoiceType.INCOME });

    const totalProjectValueQuery = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.organizationId = :organizationId', { organizationId });

    if (search.date) {
      const year = getYear(search.date);
      totalInvoiceValueQuery.andWhere('YEAR(invoice.date) = :year', { year });
      totalProjectValueQuery.andWhere('YEAR(project.startDate) = :year', {
        year,
      });
    }

    const totalInvoiceValue = await totalInvoiceValueQuery
      .select('SUM(invoice.total / invoice.exchangeRate)', 'invoiceTotal')
      .getRawOne();

    const totalProjectValue = await totalProjectValueQuery
      .select('SUM(project.totalBudget)', 'projectTotal')
      .getRawOne();

    // Total income = Total invoice income + total project budget

    return (
      parseFloat(totalInvoiceValue.invoiceTotal ?? 0) +
      parseFloat(totalProjectValue.projectTotal ?? 0)
    );
  }

  async calculateOrgTotalExpense(
    organizationId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<number> {
    const totalInvoiceValueQuery = await this.createQueryBuilder('invoice')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .andWhere('invoice.type = :type', { type: InvoiceType.EXPENSE });

    if (search.date) {
      const year = getYear(search.date);
      totalInvoiceValueQuery.andWhere('YEAR(invoice.date) = :year', { year });
    }

    const totalInvoiceValue = await totalInvoiceValueQuery
      .select('SUM(invoice.total / invoice.exchangeRate)', 'total')
      .getRawOne();

    return parseFloat(totalInvoiceValue.total ?? 0);
  }

  async calculateOrgIncomesByMonth(
    organizationId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<number[]> {
    const incomesByMonth: number[] = [];

    const totalProjectIncomeQuery = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.organizationId = :organizationId', { organizationId });

    for (let month = 1; month <= 12; month++) {
      const totalIncomeQuery = await this.createQueryBuilder('invoice')
        .select('SUM(invoice.total / invoice.exchangeRate)', 'total')
        .where('invoice.organizationId = :organizationId', { organizationId })
        .andWhere('invoice.type = :type', { type: InvoiceType.INCOME })
        .andWhere('MONTH(invoice.date) = :month', { month });

      if (search.date) {
        const year = getYear(search.date);
        totalIncomeQuery.andWhere('YEAR(invoice.date) = :year', { year });
        totalProjectIncomeQuery.andWhere('YEAR(project.startDate) = :year', {
          year,
        });
      }

      const totalIncome = await totalIncomeQuery.getRawOne();

      incomesByMonth.push(parseFloat(totalIncome.total) || 0);
    }

    // ---------------------------------------------------------------
    const totalProjectIncome = await totalProjectIncomeQuery.getMany();

    // Total income = Total invoice income + total project budget
    totalProjectIncome.map((projectIncome) => {
      const projectStartMonth = getMonth(projectIncome.startDate);
      incomesByMonth[projectStartMonth] += projectIncome.totalBudget;
    });

    return incomesByMonth;
  }

  async calculateOrgExpensesByMonth(
    organizationId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<number[]> {
    const expensesByMonth: number[] = [];

    for (let month = 1; month <= 12; month++) {
      const totalExpenseQuery = await this.createQueryBuilder('invoice')
        .select('SUM(invoice.total / invoice.exchangeRate)', 'total')
        .where('invoice.organizationId = :organizationId', { organizationId })
        .andWhere('invoice.type = :type', { type: InvoiceType.EXPENSE })
        .andWhere('MONTH(invoice.date) = :month', { month });

      if (search.date) {
        const year = getYear(search.date);
        totalExpenseQuery.andWhere('YEAR(invoice.date) = :year', { year });
      }

      const totalExpense = await totalExpenseQuery.getRawOne();

      expensesByMonth.push(parseFloat(totalExpense.total) || 0);
    }

    return expensesByMonth;
  }

  async calculateOrgTotalUncategorizedIncome(
    organizationId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<number> {
    const totalInvoiceValueQuery = await this.createQueryBuilder('invoice')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .andWhere('invoice.type = :type', { type: InvoiceType.INCOME })
      .andWhere('invoice.categoryId IS NULL');

    if (search.date) {
      const year = getYear(search.date);
      totalInvoiceValueQuery.andWhere('YEAR(invoice.date) = :year', { year });
    }

    const totalInvoiceValue = await totalInvoiceValueQuery
      .select('SUM(invoice.total / invoice.exchangeRate)', 'total')
      .getRawOne();

    return parseFloat(totalInvoiceValue.total ?? 0);
  }

  async calculateOrgTotalUncategorizedExpense(
    organizationId: number,
    search: ProjectStatisticsSearchRequestDto,
  ): Promise<number> {
    const totalInvoiceValueQuery = await this.createQueryBuilder('invoice')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .andWhere('invoice.type = :type', { type: InvoiceType.EXPENSE })
      .andWhere('invoice.categoryId IS NULL');

    if (search.date) {
      const year = getYear(search.date);
      totalInvoiceValueQuery.andWhere('YEAR(invoice.date) = :year', { year });
    }

    const totalInvoiceValue = await totalInvoiceValueQuery
      .select('SUM(invoice.total / invoice.exchangeRate)', 'total')
      .getRawOne();

    return parseFloat(totalInvoiceValue.total ?? 0);
  }
}
