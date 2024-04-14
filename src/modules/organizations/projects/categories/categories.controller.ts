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
import { CategoriesService } from './categories.service';
import { CreateCategoryRequestDto } from './dto/create-category-request.dto';
import { UpdateCategoryRequestDto } from './dto/update-category-request.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CategoryResponseDto,
  CategoryResponseListDto,
} from './dto/category-response.dto';
import { EmptyResponseDto } from 'src/modules/common/types/empty-response.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/modules/authz/permissions.guard';
import { CheckPermissions } from 'src/modules/authz/permissions.decorator';
import { PermissionAction, PermissionSubject } from 'src/db/entities';
import { CategorySearchRequestDto } from './dto/category-search-request.dto';
import { OrganizationMemberGuard } from '../../organization-member.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard, OrganizationMemberGuard)
@ApiBearerAuth('accessToken')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.CREATE, PermissionSubject.CATEGORY])
  @ApiOperation({
    tags: ['Organization Project Category'],
    operationId: "Create project's category for an organization",
    summary: "Create project's category for an organization",
    description: "Create project's category for an organization",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryResponseListDto,
  })
  async save(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() request: CreateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.create(
      organizationId,
      projectId,
      request,
    );
    return new CategoryResponseDto(category);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, PermissionSubject.CATEGORY])
  @ApiOperation({
    tags: ['Organization Project Category'],
    operationId: 'Get category list for project of organization',
    summary: 'Get category list for project of organization',
    description: 'Get category list for project of organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryResponseListDto,
  })
  async findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Query() search: CategorySearchRequestDto,
  ): Promise<CategoryResponseListDto> {
    return await this.categoriesService.findAll(
      organizationId,
      projectId,
      search,
    );
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, PermissionSubject.CATEGORY])
  @ApiOperation({
    tags: ['Organization Project Category'],
    operationId: "Get project's category by ID for an org",
    summary: "Get project's category by ID for an org",
    description: "Get project's category by ID for an org",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryResponseDto,
  })
  async findOne(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoryResponseDto> {
    return new CategoryResponseDto(
      await this.categoriesService.findOne(organizationId, projectId, id),
    );
  }

  @Patch('/:id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.UPDATE, PermissionSubject.CATEGORY])
  @ApiOperation({
    tags: ['Organization Project Category'],
    operationId: 'Update a category for a project of organization',
    summary: 'Update a category for a project of organization',
    description: 'Update a category for a project of organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryResponseDto,
  })
  async update(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() req: UpdateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    const project = await this.categoriesService.update(
      organizationId,
      projectId,
      id,
      req,
    );
    return new CategoryResponseDto(project);
  }

  @Delete('/:id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.DELETE, PermissionSubject.CATEGORY])
  @ApiOperation({
    tags: ['Organization Project Category'],
    operationId: "Delete an project's category for an organization",
    summary: "Delete an project's category for an organization",
    description: "Delete an project's category for an organization",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EmptyResponseDto,
  })
  async delete(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmptyResponseDto> {
    await this.categoriesService.delete(organizationId, projectId, id);
    return new EmptyResponseDto();
  }
}
