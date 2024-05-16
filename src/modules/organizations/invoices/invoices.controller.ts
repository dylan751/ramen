import {
  Controller,
  Get,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  InvoiceResponseDto,
  InvoiceResponseListDto,
} from './dto/invoice-response.dto';
import { EmptyResponseDto } from 'src/modules/common/types/empty-response.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { OrganizationMemberGuard } from '../organization-member.guard';
import { PermissionsGuard } from 'src/modules/authz/permissions.guard';
import { CheckPermissions } from 'src/modules/authz/permissions.decorator';
import { PermissionAction, PermissionSubject } from 'src/db/entities';
import { InvoiceSearchRequestDto } from './dto/invoice-search-request.dto';

@Controller('invoices')
@UseGuards(JwtAuthGuard, OrganizationMemberGuard)
@ApiBearerAuth('accessToken')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}
  @Get()
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, PermissionSubject.INVOICE])
  @ApiOperation({
    tags: ['Organization Invoice'],
    operationId: 'Get invoice list for organization',
    summary: 'Get invoice list for organization',
    description: 'Get invoice list for organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: InvoiceResponseListDto,
  })
  async findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query() search: InvoiceSearchRequestDto,
  ): Promise<InvoiceResponseListDto> {
    return await this.invoicesService.findAll(organizationId, search);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, PermissionSubject.INVOICE])
  @ApiOperation({
    tags: ['Organization Invoice'],
    operationId: 'Get invoice by ID for an org',
    summary: 'Get invoice by ID for an org',
    description: 'Get invoice by ID for an org',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: InvoiceResponseDto,
  })
  async findOne(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InvoiceResponseDto> {
    return new InvoiceResponseDto(
      await this.invoicesService.findOne(organizationId, id),
    );
  }

  @Delete('/:id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.DELETE, PermissionSubject.INVOICE])
  @ApiOperation({
    tags: ['Organization Invoice'],
    operationId: 'Delete an invoice for an organization',
    summary: 'Delete an invoice for an organization',
    description: 'Delete an invoice for an organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EmptyResponseDto,
  })
  async delete(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmptyResponseDto> {
    await this.invoicesService.delete(organizationId, id);
    return new EmptyResponseDto();
  }
}
