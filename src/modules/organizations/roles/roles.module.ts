import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RoleRepository } from 'src/db/repositories/role.repository';

@Module({
  controllers: [RolesController],
  providers: [RolesService, RoleRepository],
})
class RolesModule {}

export { RolesModule as OrganizationRolesModule };
