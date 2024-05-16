import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { UpdateProjectRequestDto } from './dto/update-project-request.dto';
import { ProjectRepository } from 'src/db/repositories';
import { Project } from 'src/db/entities';
import {
  ProjectResponseListDto,
  ProjectResponseDto,
} from './dto/project-response.dto';
import { ProjectSearchRequestDto } from './dto/project-search-request.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectRepository: ProjectRepository) {}

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

    if (!project) {
      throw new NotFoundException(
        `Project ${projectId} doesn't belong to organization ${organizationId}`,
      );
    }

    await this.projectRepository.manager.transaction(async (manager) => {
      const deletePromises = [];

      deletePromises.push(manager.delete(Project, { id: projectId }));

      await Promise.all(deletePromises);
    });
  }
}
