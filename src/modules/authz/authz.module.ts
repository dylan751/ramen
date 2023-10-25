import { Global, Module } from '@nestjs/common';
import { PermissionRepository, RoleRepository } from 'src/db/repositories';
import { AbilityFactory } from './ability.factory';
import { AuthzService } from './authz.service';
import { PermissionsGuard } from './permissions.guard';

@Global()
@Module({
  imports: [],
  providers: [
    AbilityFactory,
    PermissionsGuard,
    AuthzService,
    RoleRepository,
    PermissionRepository,
  ],
  exports: [AbilityFactory, PermissionsGuard],
})
export class AuthzModule {}
