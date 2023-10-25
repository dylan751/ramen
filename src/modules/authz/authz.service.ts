import { Injectable } from '@nestjs/common';
import { Role } from 'src/db/entities';
import {
  ComputedPermission,
  PermissionRepository,
  RoleRepository,
} from 'src/db/repositories';

@Injectable()
export class AuthzService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async findAllPermissionsOfRoleIds(
    roleIds: number[],
  ): Promise<Array<ComputedPermission>> {
    return await this.permissionRepository.findByRoleIds(roleIds);
  }

  async findRoles(userId: number, organizationId: number): Promise<Role[]> {
    return await this.roleRepository.findByUserIdAndOrganizationId(
      userId,
      organizationId,
    );
  }
}
