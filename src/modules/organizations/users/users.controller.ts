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

/**
 * whatever the string pass in controller decorator it will be appended to
 * API URL. to call any API from this controller you need to add prefix which is
 * passed in controller decorator.
 * in our case our base URL is http://localhost:3000/users
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // @ApiOperation({
  //   tags: ['User'],
  //   summary: 'Create user',
  //   description: 'Create user',
  // })
  // create(@Body() createUserRequestDto: CreateUserRequestDto) {
  //   return this.usersService.createUser(createUserRequestDto);
  // }

  @Get()
  @ApiOperation({
    tags: ['Organization'],
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

  // @Get(':id')
  // @ApiOperation({
  //   tags: ['User'],
  //   summary: 'Find user',
  //   description: 'Find user',
  // })
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findUser(+id);
  // }

  @Patch(':id')
  @ApiOperation({
    tags: ['Organization'],
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

  // @Delete(':id')
  // @ApiOperation({
  //   tags: ['User'],
  //   summary: 'Delete user',
  //   description: 'Delete user',
  // })
  // remove(@Param('id') id: string) {
  //   return this.usersService.removeUser(+id);
  // }
}
