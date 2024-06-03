import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { UpdateProjectRequestDto } from './dto/update-project-request.dto';
import { InvoiceRepository, ProjectRepository } from 'src/db/repositories';
import {
  Budget,
  Category,
  Invoice,
  InvoiceItem,
  Project,
  UserOrganizationInvoice,
} from 'src/db/entities';
import {
  ProjectResponseListDto,
  ProjectResponseDto,
} from './dto/project-response.dto';
import { ProjectSearchRequestDto } from './dto/project-search-request.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async create(
    organizationId: number,
    request: CreateProjectRequestDto,
    userId: number,
  ): Promise<Project> {
    const { name, description, totalBudget, startDate, endDate } = request;

    // Create project
    const project = new Project();
    project.name = name;
    project.organizationId = organizationId;
    project.description = description;
    project.totalBudget = totalBudget;
    project.startDate = startDate;
    project.endDate = endDate;
    project.creatorId = userId;

    await this.projectRepository.manager.transaction(async (manager) => {
      await manager.save(Project, project);
    });

    return project;
  }

  async findAll(
    organizationId: number,
    search: ProjectSearchRequestDto,
  ): Promise<ProjectResponseListDto> {
    const projects = await this.projectRepository.findProjectsForOrganization(
      organizationId,
      search,
    );

    const projectDtos = projects.map(
      (project) => new ProjectResponseDto(project),
    );

    const result = new ProjectResponseListDto();
    result.projects = projectDtos;
    result.metadata = {
      total: projectDtos.length,
      params: search,
    };

    return result;
  }

  async findOne(organizationId: number, projectId: number): Promise<Project> {
    const project = await this.projectRepository.findProjectForOrganization(
      organizationId,
      projectId,
    );
    if (!project) {
      throw new NotFoundException(
        `Project ${projectId} does not belong to the organization ${organizationId}`,
      );
    }

    return project;
  }

  async update(
    organizationId: number,
    projectId: number,
    req: UpdateProjectRequestDto,
  ) {
    const { name, description, totalBudget, startDate, endDate } = req;
    const project = await this.projectRepository.findOne({
      where: { id: projectId, organizationId },
    });

    if (!project) {
      throw new NotFoundException(
        `Project ${projectId} does not belong to the organization ${organizationId}`,
      );
    }

    if (name) project.name = name;
    if (description) project.description = description;
    if (totalBudget) project.totalBudget = totalBudget;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;
    await this.projectRepository.manager.transaction(async (manager) => {
      await manager.save(Project, project);
    });

    return project;
  }

  async delete(organizationId: number, projectId: number): Promise<void> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, organizationId },
    });

    const projectInvoices =
      await this.invoiceRepository.findInvoicesForProjectOfOrganization(
        organizationId,
        projectId,
        {},
      );

    if (!project) {
      throw new NotFoundException(
        `Project ${projectId} doesn't belong to organization ${organizationId}`,
      );
    }

    await this.projectRepository.manager.transaction(async (manager) => {
      const deletePromises = [];

      projectInvoices.forEach((invoice) => {
        deletePromises.push(
          manager.delete(UserOrganizationInvoice, {
            organizationId,
            invoiceId: invoice.id,
          }),
        );
        deletePromises.push(
          manager.delete(InvoiceItem, { invoiceId: invoice.id }),
        );
      });

      deletePromises.push(manager.delete(Invoice, { projectId }));

      deletePromises.push(manager.delete(Budget, { projectId }));
      deletePromises.push(manager.delete(Category, { projectId }));
      deletePromises.push(manager.delete(Project, { id: projectId }));

      await Promise.all(deletePromises);
    });
  }
}
