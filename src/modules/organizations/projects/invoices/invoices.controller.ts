import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Request,
  ParseIntPipe,
  UseGuards,
  Query,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { ProjectInvoicesService } from './invoices.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  InvoiceResponseDto,
  InvoiceResponseListDto,
} from './dto/invoice-response.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/modules/authz/permissions.guard';
import { CheckPermissions } from 'src/modules/authz/permissions.decorator';
import { PermissionAction, PermissionSubject } from 'src/db/entities';
import { InvoiceSearchRequestDto } from './dto/invoice-search-request.dto';
import { OrganizationMemberGuard } from '../../organization-member.guard';
import { CreateInvoiceRequestDto } from './dto/create-invoice-request.dto';
import { AuthenticatedRequest } from 'src/modules/common/types/authenticated-request';
import { UpdateInvoiceRequestDto } from './dto/update-invoice-request.dto';

@Controller('invoices')
@UseGuards(JwtAuthGuard, OrganizationMemberGuard)
@ApiBearerAuth('accessToken')
export class ProjectInvoicesController {
  constructor(private readonly invoicesService: ProjectInvoicesService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.CREATE, PermissionSubject.INVOICE])
  @ApiOperation({
    tags: ['Organization Project Invoice'],
    operationId: 'Create invoices for a project of organization',
    summary: 'Create invoices for a project of organization',
    description: 'Create invoices for a project of organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: InvoiceResponseListDto,
  })
  async save(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() request: CreateInvoiceRequestDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.invoicesService.create(
      organizationId,
      projectId,
      request,
      req.user.id,
    );
    return new InvoiceResponseDto(invoice);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, PermissionSubject.INVOICE])
  @ApiOperation({
    tags: ['Organization Project Invoice'],
    operationId: 'Get invoice list for a project of organization',
    summary: 'Get invoice list for a project of organization',
    description: 'Get invoice list for a project of organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: InvoiceResponseListDto,
  })
  async findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Query() search: InvoiceSearchRequestDto,
  ): Promise<InvoiceResponseListDto> {
    return await this.invoicesService.findAll(
      organizationId,
      projectId,
      search,
    );
  }

  @Patch('/:id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.UPDATE, PermissionSubject.INVOICE])
  @ApiOperation({
    tags: ['Organization Project Invoice'],
    operationId: 'Update an invoice for a project of organization',
    summary: 'Update an invoice for a project of organization',
    description: 'Update an invoice for a project of organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: InvoiceResponseDto,
  })
  async update(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() req: UpdateInvoiceRequestDto,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.invoicesService.update(
      organizationId,
      projectId,
      id,
      req,
    );
    return new InvoiceResponseDto(invoice);
  }
}
