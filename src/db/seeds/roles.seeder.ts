import { Seeder } from '@jorgebodega/typeorm-seeding';
import { plainToInstance } from 'class-transformer';
import * as csvtojson from 'csvtojson';
import { DataSource } from 'typeorm';
import { Role } from 'src/db/entities';
import { batchInsertWithoutEntityReload } from 'src/modules/common/utils';

export default class RoleSeeder extends Seeder {
  public csvFilePath = 'src/db/seeds/roles.csv';

  public async run(dataSource: DataSource): Promise<void> {
    const data = await csvtojson().fromFile(this.csvFilePath);

    const insertData = data.map((obj) => ({
      id: parseInt(obj.id),
      name: obj.name,
      slug: obj.slug,
      organizationId: obj.organizationId,
    }));
    const roles = plainToInstance<Role, unknown>(Role, insertData);

    await dataSource.transaction(async (transactionalEntityManager) => {
      // drop and recreate standard roles
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(Role, 'role')
        .where('organizationId = 0') // standard roles: Admin, Member, ...
        .execute();
      await batchInsertWithoutEntityReload(transactionalEntityManager, roles);
    });
  }
}
