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
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { OrganizationUserListResponseDto } from './dto/organization-user-list-response.dto';

/**
 * whatever the string pass in controller decorator it will be appended to
 * API URL. to call any API from this controller you need to add prefix which is
 * passed in controller decorator.
 * in our case our base URL is http://localhost:3000/users
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Post decorator represents method of request as we have used post decorator the method
   * of this API will be post.
   * so the API URL to create User will be
   * POST http://localhost:3000/users
   */
  @Post()
  @ApiOperation({
    tags: ['User'],
    summary: 'Create user',
    description: 'Create user',
  })
  create(@Body() createUserRequestDto: CreateUserRequestDto) {
    return this.usersService.createUser(createUserRequestDto);
  }

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

  /**
   * we have used get decorator with id param to get id from request
   * so the API URL will be
   * GET http://localhost:3000/users/:id
   */
  @Get(':id')
  @ApiOperation({
    tags: ['User'],
    summary: 'Find user',
    description: 'Find user',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findUser(+id);
  }

  /**
   * we have used patch decorator with id param to get id from request
   * so the API URL will be
   * PATCH http://localhost:3000/users/:id
   */
  @Patch(':id')
  @ApiOperation({
    tags: ['User'],
    summary: 'Update user',
    description: 'Update user',
  })
  update(
    @Param('id') id: string,
    @Body() updateUserRequestDto: UpdateUserRequestDto,
  ) {
    return this.usersService.updateUser(+id, updateUserRequestDto);
  }

  /**
   * we have used Delete decorator with id param to get id from request
   * so the API URL will be
   * DELETE http://localhost:3000/users/:id
   */
  @Delete(':id')
  @ApiOperation({
    tags: ['User'],
    summary: 'Delete user',
    description: 'Delete user',
  })
  remove(@Param('id') id: string) {
    return this.usersService.removeUser(+id);
  }
}
