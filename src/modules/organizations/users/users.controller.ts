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
import { OrganizationUserResponseDto } from '../../common/dto/organization-user-response.dto';
import { UpdateOrganizationUserRequestDto } from './dto/update-organization-user-request.dto';
import { EmptyResponseDto } from 'src/modules/common/types/empty-response.dto';
import { TotalAdminResponseDto } from './dto/total-admin-response.dto';
import { BulkInviteRequestDto } from './dto/bulk-invite-request.dto';
import { BulkInviteResponseDto } from './dto/bulk-invite-response.dto';

/**
 * whatever the string pass in controller decorator it will be appended to
 * API URL. to call any API from this controller you need to add prefix which is
 * passed in controller decorator.
 * in our case our base URL is http://localhost:3000/users
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Get('admin-count')
  @ApiOperation({
    tags: ['Organization User'],
    summary: 'Count total admins',
    description: 'Count total admins',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TotalAdminResponseDto,
  })
  async countAdmin(
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ): Promise<TotalAdminResponseDto> {
    return await this.usersService.countAdmin(organizationId);
  }

  @Post('bulk-invitations')
  @ApiOperation({
    tags: ['Organization User'],
    summary: 'Bulk invite users',
    description: 'Bulk invite users',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BulkInviteResponseDto,
  })
  async bulkInvite(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Body() requestDto: BulkInviteRequestDto,
  ): Promise<BulkInviteResponseDto> {
    return await this.usersService.bulkInvite(organizationId, requestDto);
  }

  @Patch(':id')
  @ApiOperation({
    tags: ['Organization User'],
    summary: 'Edit organization users information',
    description: 'Edit organization users information',
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
