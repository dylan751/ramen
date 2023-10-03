import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
  Permission,
  PermissionAction,
  PermissionObject,
} from 'src/db/entities';

@Injectable()
export class PermissionRepository extends Repository<Permission> {
  constructor(private dataSource: DataSource) {
    super(Permission, dataSource.createEntityManager());
  }

  async findByPermissionConfig(
    action: PermissionAction,
    object: PermissionObject,
  ): Promise<Permission> {
    return await this.findOne({ where: { action, object } });
  }

  async findByRoleIds(roleIds: number[]): Promise<Array<Permission>> {
    return await this.createQueryBuilder('permission')
      .select()
      .addSelect('role.id', 'roleId')
      .innerJoin('permission.rolePermissions', 'rolePermissions')
      .where('rolePermissions.roleId IN (:ids)', { ids: roleIds })
      .getMany();
  }
}
