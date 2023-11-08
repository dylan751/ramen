import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { PermissionsService } from './permissions.service';
import { PermissionSubjectResponseDto } from './dto/permission-subject-response.dto';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({
    tags: ['Permission'],
    operationId: 'Get permission subject list',
    summary: 'Get permission subject list',
    description: 'Get permission subject list',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [PermissionSubjectResponseDto],
  })
  async findAll(): Promise<PermissionSubjectResponseDto[]> {
    return await this.permissionsService.findAll();
  }
}
