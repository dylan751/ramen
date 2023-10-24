import { Seeder } from '@jorgebodega/typeorm-seeding';
import * as csvtojson from 'csvtojson';
import { DataSource } from 'typeorm';
import { RolePermission } from '../entities';
import { batchInsertWithoutEntityReload } from 'src/modules/common/utils';
import { plainToInstance } from 'class-transformer';

export default class RolePermissionSeeder extends Seeder {
  public csvFilePath = 'src/db/seeds/role-permissions.csv';

  public async run(dataSource: DataSource): Promise<void> {
    const data = await csvtojson().fromFile(this.csvFilePath);

    const insertData = data.map((obj) => ({
      id: parseInt(obj.id),
      roleId: parseInt(obj.roleId),
      permissionId: parseInt(obj.permissionId),
    }));
    const rolePermissions = plainToInstance<RolePermission, unknown>(
      RolePermission,
      insertData,
    );

    await dataSource.transaction(async (transactionalEntityManager) => {
      // drop and recreate standard roles's role-permission
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(RolePermission, 'role_permission')
        .where('"roleId" = 1') // standard roles: Admin, Member, ...
        .orWhere('"roleId" = 2')
        .execute();
      await batchInsertWithoutEntityReload(
        transactionalEntityManager,
        rolePermissions,
      );
    });
  }
}
