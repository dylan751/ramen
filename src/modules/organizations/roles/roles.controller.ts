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
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { UpdateRoleRequestDto } from './dto/update-role-request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleResponseDto, RoleResponseListDto } from './dto/role-response.dto';
import { EmptyResponseDto } from 'src/modules/common/types/empty-response.dto';

@Controller('roles')
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleRequestDto: UpdateRoleRequestDto,
  ) {
    return this.rolesService.update(+id, updateRoleRequestDto);
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
