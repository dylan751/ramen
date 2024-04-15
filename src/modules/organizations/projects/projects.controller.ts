import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { UpdateProjectRequestDto } from './dto/update-project-request.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  ProjectResponseDto,
  ProjectResponseListDto,
} from './dto/project-response.dto';
import { EmptyResponseDto } from 'src/modules/common/types/empty-response.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { OrganizationMemberGuard } from '../organization-member.guard';
import { PermissionsGuard } from 'src/modules/authz/permissions.guard';
import { CheckPermissions } from 'src/modules/authz/permissions.decorator';
import { PermissionAction, PermissionSubject } from 'src/db/entities';
import { ProjectSearchRequestDto } from './dto/project-search-request.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard, OrganizationMemberGuard)
@ApiBearerAuth('accessToken')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.CREATE, PermissionSubject.PROJECT])
  @ApiOperation({
    tags: ['Organization Project'],
    operationId: 'Create projects for an organization',
    summary: 'Create projects for an organization',
    description: 'Create projects for an organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectResponseListDto,
  })
  async save(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Body() request: CreateProjectRequestDto,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectsService.create(organizationId, request);
    return new ProjectResponseDto(project);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, PermissionSubject.PROJECT])
  @ApiOperation({
    tags: ['Organization Project'],
    operationId: 'Get project list for organization',
    summary: 'Get project list for organization',
    description: 'Get project list for organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectResponseListDto,
  })
  async findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query() search: ProjectSearchRequestDto,
  ): Promise<ProjectResponseListDto> {
    return await this.projectsService.findAll(organizationId, search);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, PermissionSubject.PROJECT])
  @ApiOperation({
    tags: ['Organization Project'],
    operationId: 'Get project by ID for an org',
    summary: 'Get project by ID for an org',
    description: 'Get project by ID for an org',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectResponseDto,
  })
  async findOne(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProjectResponseDto> {
    return new ProjectResponseDto(
      await this.projectsService.findOne(organizationId, id),
    );
  }

  @Patch('/:id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.UPDATE, PermissionSubject.PROJECT])
  @ApiOperation({
    tags: ['Organization Project'],
    operationId: 'Update a project for an organization',
    summary: 'Update a project for an organization',
    description: 'Update a project for an organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectResponseDto,
  })
  async update(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() req: UpdateProjectRequestDto,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectsService.update(organizationId, id, req);
    return new ProjectResponseDto(project);
  }

  @Delete('/:id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.DELETE, PermissionSubject.PROJECT])
  @ApiOperation({
    tags: ['Organization Project'],
    operationId: 'Delete a project for an organization',
    summary: 'Delete a project for an organization',
    description: 'Delete a project for an organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EmptyResponseDto,
  })
  async delete(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmptyResponseDto> {
    await this.projectsService.delete(organizationId, id);
    return new EmptyResponseDto();
  }
}
