import { Injectable, NotFoundException } from '@nestjs/common';
import {
  InvoiceRepository,
  OrganizationRepository,
  ProjectRepository,
  UserRepository,
  RoleRepository,
} from 'src/db/repositories';
import { OrganizationStatisticsResponseDto } from './dto/organization-statistics-response.dto';
import { OrganizationStatisticsSearchRequestDto } from './dto/organization-statistics-search-request.dto';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly orgRepository: OrganizationRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async getStatistics(
    organizationId: number,
    search: OrganizationStatisticsSearchRequestDto,
  ): Promise<OrganizationStatisticsResponseDto> {
    const organization = await this.orgRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException(
        `Organization ${organizationId} doesn't exist`,
      );
    }

    const [
      projectCount,
      invoiceCount,
      userCount,
      roleCount,
      totalIncome,
      totalExpense,
      incomesByMonth,
      expensesByMonth,
      totalUncategorizedIncome,
      totalUncategorizedExpense,
      projects,
    ] = await Promise.all([
      this.projectRepository.countOrgProjects(organizationId, search),
      this.invoiceRepository.countOrgInvoices(organizationId, search),
      this.userRepository.countUserInOrganization(organizationId),
      this.roleRepository.countOrgRoles(organizationId),
      this.invoiceRepository.calculateOrgTotalIncome(organizationId, search),
      this.invoiceRepository.calculateOrgTotalExpense(organizationId, search),
      this.invoiceRepository.calculateOrgIncomesByMonth(organizationId, search),
      this.invoiceRepository.calculateOrgExpensesByMonth(
        organizationId,
        search,
      ),
      this.invoiceRepository.calculateOrgTotalUncategorizedIncome(
        organizationId,
        search,
      ),
      this.invoiceRepository.calculateOrgTotalUncategorizedExpense(
        organizationId,
        search,
      ),
      this.projectRepository.getOrgProjects(organizationId, search),
    ]);

    const organizationStatistics = new OrganizationStatisticsResponseDto();
    organizationStatistics.id = organization.id;
    organizationStatistics.name = organization.name;
    organizationStatistics.created = organization.createdAt;
    organizationStatistics.projectCount = projectCount;
    organizationStatistics.invoiceCount = invoiceCount;
    organizationStatistics.userCount = userCount;
    organizationStatistics.roleCount = roleCount;
    organizationStatistics.totalIncome = totalIncome;
    organizationStatistics.totalExpense = totalExpense;
    organizationStatistics.incomesByMonth = incomesByMonth;
    organizationStatistics.expensesByMonth = expensesByMonth;
    organizationStatistics.totalUncategorizedIncome = totalUncategorizedIncome;
    organizationStatistics.totalUncategorizedExpense =
      totalUncategorizedExpense;
    organizationStatistics.projects = projects;
    organizationStatistics.balance = totalIncome - totalExpense;

    return organizationStatistics;
  }
}
