import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpStatus,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { UpdateOrganizationRequestDto } from './dto/update-organization-request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrganizationResponseDto } from './dto/organization-response.dto';
import { AuthenticatedRequest } from '../common/types/authenticated-request';
import { EmptyResponseDto } from '../common/types/empty-response.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Post()
  @ApiOperation({
    tags: ['Organization'],
    summary: 'Create new organization',
    description:
      'Create new organization with organization name (Example org) and global unique name (example-org)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrganizationResponseDto,
  })
  async create(
    @Body() createRequest: CreateOrganizationRequestDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<OrganizationResponseDto> {
    return await this.orgService.create(createRequest, req.user.id);
  }

  @Get()
  @ApiOperation({
    tags: ['Organization'],
    summary: 'Get all organizations',
    description: 'Get all organizations',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [OrganizationResponseDto],
  })
  async findAll(): Promise<OrganizationResponseDto[]> {
    return await this.orgService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    tags: ['Organization'],
    operationId: 'Get organization',
    summary: 'Get organization',
    description: 'Get organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrganizationResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrganizationResponseDto> {
    const org = await this.orgService.findById(id);
    if (org === undefined || org === null) {
      throw new NotFoundException(`Can't find org with id is ${id}`);
    }
    return new OrganizationResponseDto(org);
  }

  @Patch(':id')
  @ApiOperation({
    tags: ['Organization'],
    operationId: 'Update organization',
    summary: 'Update organization',
    description: 'Update organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrganizationResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRequest: UpdateOrganizationRequestDto,
  ): Promise<OrganizationResponseDto> {
    return await this.orgService.update(id, updateRequest);
  }

  @Delete(':id')
  @ApiOperation({
    tags: ['Organization'],
    operationId: 'Delete an organization',
    summary: 'Delete an organization',
    description: 'Delete an organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EmptyResponseDto,
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmptyResponseDto> {
    await this.orgService.delete(id);
    return new EmptyResponseDto();
  }
}
