import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RoleRepository } from 'src/db/repositories/role.repository';
import { PermissionRepository } from 'src/db/repositories/permission.repository';

@Module({
  controllers: [RolesController],
  providers: [RolesService, RoleRepository, PermissionRepository],
})
class RolesModule {}

export { RolesModule as OrganizationRolesModule };
