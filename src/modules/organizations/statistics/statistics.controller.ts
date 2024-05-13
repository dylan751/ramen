import {
  Controller,
  Get,
  Param,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { OrganizationStatisticsResponseDto } from './dto/organization-statistics-response.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/modules/authz/permissions.guard';
import { CheckPermissions } from 'src/modules/authz/permissions.decorator';
import { PermissionAction, PermissionSubject } from 'src/db/entities';
import { OrganizationStatisticsSearchRequestDto } from './dto/organization-statistics-search-request.dto';
import { OrganizationMemberGuard } from '../organization-member.guard';

@Controller('statistics')
@UseGuards(JwtAuthGuard, OrganizationMemberGuard)
@ApiBearerAuth('accessToken')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, PermissionSubject.ORGANIZATION])
  @ApiOperation({
    tags: ['Organization Statistics'],
    operationId: 'Get statistics for organization',
    summary: 'Get statistics for organization',
    description: 'Get statistics for organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrganizationStatisticsResponseDto,
  })
  async getStatistics(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query() search: OrganizationStatisticsSearchRequestDto,
  ): Promise<OrganizationStatisticsResponseDto> {
    return await this.statisticsService.getStatistics(organizationId, search);
  }
}
