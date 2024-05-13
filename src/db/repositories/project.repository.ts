import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Project } from 'src/db/entities';
import { ProjectSearchRequestDto } from 'src/modules/organizations/projects/dto/project-search-request.dto';
import { getYear, isAfter, isBefore, isEqual } from 'date-fns';
import { OrganizationStatisticsSearchRequestDto } from 'src/modules/organizations/statistics/dto/organization-statistics-search-request.dto';

@Injectable()
export class ProjectRepository extends Repository<Project> {
  constructor(private dataSource: DataSource) {
    super(Project, dataSource.createEntityManager());
  }

  async findProjectsForOrganization(
    organizationId: number,
    search: ProjectSearchRequestDto,
  ): Promise<Project[]> {
    const allProjects = await this.createQueryBuilder('project')
      .leftJoinAndSelect('project.creator', 'creator')
      .leftJoinAndSelect('creator.userOrganizations', 'userOrganizations')
      .leftJoinAndSelect('userOrganizations.roles', 'roles')
      .leftJoinAndSelect('project.invoices', 'invoices')
      .leftJoinAndSelect('project.budgets', 'budgets')
      .leftJoinAndSelect('project.categories', 'categories')
      .where('project.organizationId = :organizationId', { organizationId })
      .getMany();

    let filteredProjects = allProjects;

    if (search.query) {
      const queryLowered = search.query.toLowerCase();
      filteredProjects = filteredProjects.filter(
        (project) =>
          project.name.toLowerCase().includes(queryLowered) ||
          project.description.toLowerCase().includes(queryLowered),
      );
    }

    if (search.fromDate) {
      filteredProjects = filteredProjects.filter(
        (project) =>
          isAfter(project.startDate, new Date(search.fromDate)) ||
          isEqual(project.startDate, new Date(search.fromDate)),
      );
    }

    if (search.toDate) {
      filteredProjects = filteredProjects.filter(
        (project) =>
          isBefore(project.startDate, new Date(search.toDate)) ||
          isEqual(project.startDate, new Date(search.toDate)),
      );
    }

    return filteredProjects;
  }

  async findProjectForOrganization(
    organizationId: number,
    id: number,
  ): Promise<Project> {
    return await this.createQueryBuilder('project')
      .leftJoinAndSelect('project.creator', 'creator')
      .leftJoinAndSelect('creator.userOrganizations', 'userOrganizations')
      .leftJoinAndSelect('userOrganizations.roles', 'roles')
      .leftJoinAndSelect('project.invoices', 'invoices')
      .leftJoinAndSelect('project.budgets', 'budgets')
      .leftJoinAndSelect('project.categories', 'categories')
      .where('project.organizationId = :organizationId', { organizationId })
      .andWhere('project.id = :id', { id })
      .getOne();
  }

  async countOrgProjects(
    organizationId: number,
    search: OrganizationStatisticsSearchRequestDto,
  ): Promise<number> {
    const projectsCountQuery = await this.createQueryBuilder('project').where(
      'project.organizationId = :organizationId',
      { organizationId },
    );

    if (search.date) {
      const year = getYear(search.date);
      projectsCountQuery.andWhere('YEAR(project.startDate) = :year', { year });
    }

    const projectsCount = await projectsCountQuery.getCount();
    return projectsCount;
  }

  async getOrgProjects(
    organizationId: number,
    search: OrganizationStatisticsSearchRequestDto,
  ): Promise<Project[]> {
    const projectsQuery = await this.createQueryBuilder('project').where(
      'project.organizationId = :organizationId',
      { organizationId },
    );

    if (search.date) {
      const year = getYear(search.date);
      projectsQuery.andWhere('YEAR(project.startDate) = :year', { year });
    }

    const projects = await projectsQuery.getMany();
    return projects;
  }
}
