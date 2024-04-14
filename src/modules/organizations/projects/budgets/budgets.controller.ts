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
import { BudgetsService } from './budgets.service';
import { CreateBudgetRequestDto } from './dto/create-budget-request.dto';
import { UpdateBudgetRequestDto } from './dto/update-budget-request.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  BudgetResponseDto,
  BudgetResponseListDto,
} from './dto/budget-response.dto';
import { EmptyResponseDto } from 'src/modules/common/types/empty-response.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/modules/authz/permissions.guard';
import { CheckPermissions } from 'src/modules/authz/permissions.decorator';
import { PermissionAction, PermissionSubject } from 'src/db/entities';
import { BudgetSearchRequestDto } from './dto/budget-search-request.dto';
import { OrganizationMemberGuard } from '../../organization-member.guard';

@Controller('budget')
@UseGuards(JwtAuthGuard, OrganizationMemberGuard)
@ApiBearerAuth('accessToken')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.CREATE, PermissionSubject.BUDGET])
  @ApiOperation({
    tags: ['Organization Project Budget'],
    operationId: "Create project's budget for an organization",
    summary: "Create project's budget for an organization",
    description: "Create project's budget for an organization",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BudgetResponseListDto,
  })
  async save(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() request: CreateBudgetRequestDto,
  ): Promise<BudgetResponseDto> {
    const budget = await this.budgetsService.create(
      organizationId,
      projectId,
      request,
    );
    return new BudgetResponseDto(budget);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, PermissionSubject.BUDGET])
  @ApiOperation({
    tags: ['Organization Project Budget'],
    operationId: 'Get budget list for project of organization',
    summary: 'Get budget list for project of organization',
    description: 'Get budget list for project of organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BudgetResponseListDto,
  })
  async findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Query() search: BudgetSearchRequestDto,
  ): Promise<BudgetResponseListDto> {
    return await this.budgetsService.findAll(organizationId, projectId, search);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, PermissionSubject.BUDGET])
  @ApiOperation({
    tags: ['Organization Project Budget'],
    operationId: "Get project's budget by ID for an org",
    summary: "Get project's budget by ID for an org",
    description: "Get project's budget by ID for an org",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BudgetResponseDto,
  })
  async findOne(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BudgetResponseDto> {
    return new BudgetResponseDto(
      await this.budgetsService.findOne(organizationId, projectId, id),
    );
  }

  @Patch('/:id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.UPDATE, PermissionSubject.BUDGET])
  @ApiOperation({
    tags: ['Organization Project Budget'],
    operationId: 'Update a budget for a project of organization',
    summary: 'Update a budget for a project of organization',
    description: 'Update a budget for a project of organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BudgetResponseDto,
  })
  async update(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() req: UpdateBudgetRequestDto,
  ): Promise<BudgetResponseDto> {
    const project = await this.budgetsService.update(
      organizationId,
      projectId,
      id,
      req,
    );
    return new BudgetResponseDto(project);
  }

  @Delete('/:id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.DELETE, PermissionSubject.BUDGET])
  @ApiOperation({
    tags: ['Organization Project Budget'],
    operationId: "Delete an project's budget for an organization",
    summary: "Delete an project's budget for an organization",
    description: "Delete an project's budget for an organization",
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
    await this.budgetsService.delete(organizationId, projectId, id);
    return new EmptyResponseDto();
  }
}
