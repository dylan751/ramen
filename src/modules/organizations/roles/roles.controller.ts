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
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { UpdateRoleRequestDto } from './dto/update-role-request.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleResponseDto, RoleResponseListDto } from './dto/role-response.dto';
import { EmptyResponseDto } from 'src/modules/common/types/empty-response.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { OrganizationMemberGuard } from '../organization-member.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard, OrganizationMemberGuard)
@ApiBearerAuth('accessToken')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({
    tags: ['Organization Role'],
    operationId: 'Create roles for an organization',
    summary: 'Create roles for an organization',
    description: 'Create roles for an organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RoleResponseListDto,
  })
  async save(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Body() request: CreateRoleRequestDto,
  ): Promise<RoleResponseDto> {
    const role = await this.rolesService.create(organizationId, request);
    return new RoleResponseDto(role);
  }

  @Get()
  @ApiOperation({
    tags: ['Organization Role'],
    operationId: 'Get role list for organization',
    summary: 'Get role list for organization',
    description: 'Get role list for organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RoleResponseListDto,
  })
  async findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ): Promise<RoleResponseListDto> {
    return new RoleResponseListDto(
      await this.rolesService.findAll(organizationId),
    );
  }

  @Get(':id')
  @ApiOperation({
    tags: ['Organization Role'],
    operationId: 'Get role by ID for an org',
    summary: 'Get role by ID for an org',
    description: 'Get role by ID for an org',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RoleResponseDto,
  })
  async findOne(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RoleResponseDto> {
    return new RoleResponseDto(
      await this.rolesService.findOne(organizationId, id),
    );
  }

  @Patch('/:id')
  @ApiOperation({
    tags: ['Organization Role'],
    operationId: 'Update a role for an organization',
    summary: 'Update a role for an organization',
    description: 'Update a role for an organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RoleResponseDto,
  })
  async update(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() req: UpdateRoleRequestDto,
  ): Promise<RoleResponseDto> {
    const role = await this.rolesService.update(organizationId, id, req);
    return new RoleResponseDto(role);
  }

  @Delete('/:id')
  @ApiOperation({
    tags: ['Organization Role'],
    operationId: 'Delete a role for an organization',
    summary: 'Delete a role for an organization',
    description: 'Delete a role for an organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EmptyResponseDto,
  })
  async delete(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmptyResponseDto> {
    await this.rolesService.delete(organizationId, id);
    return new EmptyResponseDto();
  }
}
