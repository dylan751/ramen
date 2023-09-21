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
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { UpdateOrganizationRequestDto } from './dto/update-organization-request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrganizationResponseDto } from './dto/organization-response.dto';
import { AuthenticatedRequest } from '../common/types/authenticated-request';

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
    const org = await this.orgService.create(createRequest, req.user.id);
    return new OrganizationResponseDto(org);
  }

  @Get()
  findAll() {
    return this.orgService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orgService.findOne(+id);
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
    const org = await this.orgService.update(id, updateRequest);
    return new OrganizationResponseDto(org);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orgService.remove(+id);
  }
}
