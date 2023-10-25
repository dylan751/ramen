import { createMongoAbility, MongoAbility, ForcedSubject } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User, PermissionAction, PermissionSubject } from 'src/db/entities';
import { AuthzService } from './authz.service';

type AppAbilitySubject =
  | PermissionSubject
  | (Record<string, any> & ForcedSubject<PermissionSubject>);

export type AppAbility = MongoAbility<[PermissionAction, AppAbilitySubject]>;

export interface CaslPermission {
  action: PermissionAction;
  subject: PermissionSubject;
}

type Permissions = {
  unconditionalAbilities: AppAbility;
};

@Injectable()
export class AbilityFactory {
  constructor(private authzService: AuthzService) {}

  async createForUser(
    user: User,
    organizationId: number,
  ): Promise<Permissions> {
    const unconditionalPermissions: CaslPermission[] = [];

    if (organizationId) {
      const roles = await this.authzService.findRoles(user.id, organizationId);
      console.log('Roles', roles);
      const roleIds = roles.map((role) => role.id);
      const computedPermissions =
        await this.authzService.findAllPermissionsOfRoleIds(roleIds);
      console.log('Computed permissions', computedPermissions);

      computedPermissions.forEach((computedPermission) => {
        const permission: CaslPermission = {
          action: computedPermission.action,
          subject: computedPermission.subject,
        };

        unconditionalPermissions.push(permission);
        console.log('Unconditional permissions', unconditionalPermissions);
      });
    }

    return {
      unconditionalAbilities: createMongoAbility(unconditionalPermissions),
    };
  }
}
