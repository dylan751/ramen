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
      const roleIds = roles.map((role) => role.id);
      const computedPermissions =
        await this.authzService.findAllPermissionsOfRoleIds(roleIds);

      computedPermissions.forEach((computedPermission) => {
        const permission: CaslPermission = {
          action: computedPermission.action,
          subject: computedPermission.subject,
        };

        unconditionalPermissions.push(permission);
      });
    }

    return {
      unconditionalAbilities: createMongoAbility(unconditionalPermissions),
    };
  }
}
