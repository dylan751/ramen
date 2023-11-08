import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import {
  OrganizationRepository,
  PermissionRepository,
} from 'src/db/repositories';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, OrganizationRepository, PermissionRepository],
})
export class PermissionsModule {}
