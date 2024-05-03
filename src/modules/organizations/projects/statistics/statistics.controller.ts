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
import { ProjectStatisticsResponseDto } from './dto/project-statistics-response.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/modules/authz/permissions.guard';
import { CheckPermissions } from 'src/modules/authz/permissions.decorator';
import { PermissionAction, PermissionSubject } from 'src/db/entities';
import { ProjectStatisticsSearchRequestDto } from './dto/project-statistics-search-request.dto';
import { OrganizationMemberGuard } from '../../organization-member.guard';

@Controller('statistics')
@UseGuards(JwtAuthGuard, OrganizationMemberGuard)
@ApiBearerAuth('accessToken')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, PermissionSubject.PROJECT])
  @ApiOperation({
    tags: ['Organization Project Statistics'],
    operationId: 'Get statistics for project of organization',
    summary: 'Get statistics for project of organization',
    description: 'Get statistics for project of organization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectStatisticsResponseDto,
  })
  async getStatistics(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Query() search: ProjectStatisticsSearchRequestDto,
  ): Promise<ProjectStatisticsResponseDto> {
    return await this.statisticsService.getStatistics(
      organizationId,
      projectId,
      search,
    );
  }
}
