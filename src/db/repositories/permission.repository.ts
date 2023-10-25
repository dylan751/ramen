import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
  Permission,
  PermissionAction,
  PermissionSubject,
} from 'src/db/entities';
import { CaslPermission } from 'src/modules/authz/ability.factory';

export interface ComputedPermission {
  action: CaslPermission['action'];
  subject: CaslPermission['subject'];
  roleId: number;
}

@Injectable()
export class PermissionRepository extends Repository<Permission> {
  constructor(private dataSource: DataSource) {
    super(Permission, dataSource.createEntityManager());
  }

  async findByPermissionConfig(
    action: PermissionAction,
    subject: PermissionSubject,
  ): Promise<Permission> {
    return await this.findOne({ where: { action, subject } });
  }

  async findByRoleIds(roleIds: number[]): Promise<Array<ComputedPermission>> {
    return await this.createQueryBuilder('permission')
      .select('permission.action', 'action')
      .addSelect('permission.subject', 'subject')
      .addSelect('rolePermissions.roleId', 'roleId')
      .innerJoin('permission.rolePermissions', 'rolePermissions')
      .where('rolePermissions.roleId IN (:ids)', { ids: roleIds })
      .getRawMany();
  }
}
