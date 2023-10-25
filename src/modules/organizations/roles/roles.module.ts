import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RoleRepository } from 'src/db/repositories/role.repository';
import { PermissionRepository } from 'src/db/repositories/permission.repository';
import { MetadataScanner } from '@nestjs/core';
import { AuthzModule } from 'src/modules/authz/authz.module';

@Module({
  imports: [AuthzModule],
  controllers: [RolesController],
  providers: [
    MetadataScanner,
    RolesService,
    RoleRepository,
    PermissionRepository,
  ],
})
class RolesModule {}

export { RolesModule as OrganizationRolesModule };
