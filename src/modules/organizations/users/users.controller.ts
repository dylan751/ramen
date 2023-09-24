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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { OrganizationUserListResponseDto } from './dto/organization-user-list-response.dto';
import { OrganizationUserResponseDto } from './dto/organization-user-response.dto';
import { UpdateOrganizationUserRequestDto } from './dto/update-organization-user-request.dto';
import { EmptyResponseDto } from 'src/modules/common/types/empty-response.dto';
import { CreateOrganizationUserRequestDto } from './dto/create-organization-user-request.dto';

/**
 * whatever the string pass in controller decorator it will be appended to
 * API URL. to call any API from this controller you need to add prefix which is
 * passed in controller decorator.
 * in our case our base URL is http://localhost:3000/users
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    tags: ['Organization User'],
    summary: 'Create organization user',
    description: 'Create organization user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrganizationUserResponseDto,
  })
  create(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Body() request: CreateOrganizationUserRequestDto,
  ) {
    return this.usersService.create(organizationId, request);
  }

  @Get()
  @ApiOperation({
    tags: ['Organization User'],
    summary: 'Get all organization users',
    description: 'Get all organization users',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [OrganizationUserListResponseDto],
  })
  async findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ): Promise<OrganizationUserListResponseDto> {
    return await this.usersService.findByOrganization(organizationId);
  }

  @Get(':id')
  @ApiOperation({
    tags: ['Organization User'],
    summary: 'Get 1 organization user',
    description: 'Get 1 organization user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrganizationUserResponseDto,
  })
  findOne(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<OrganizationUserResponseDto> {
    return this.usersService.findByUserId(organizationId, userId);
  }

  @Patch(':id')
  @ApiOperation({
    tags: ['Organization User'],
    summary: 'Edit organization users role',
    description: 'Edit organization users role',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrganizationUserResponseDto,
  })
  async update(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) userId: number,
    @Body() request: UpdateOrganizationUserRequestDto,
  ): Promise<OrganizationUserResponseDto> {
    return await this.usersService.update(organizationId, userId, request);
  }

  @Delete(':id')
  @ApiOperation({
    tags: ['Organization User'],
    summary: 'Delete an organization user',
    description: 'Delete an organization user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EmptyResponseDto,
  })
  async delete(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<void> {
    await this.usersService.deleteByIdAndOrgId(organizationId, userId);
  }
}
