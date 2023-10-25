import { Seeder } from '@jorgebodega/typeorm-seeding';
import * as csvtojson from 'csvtojson';
import { DataSource } from 'typeorm';
import { Permission } from '../entities';

export default class PermissionSeeder extends Seeder {
  public csvFilePath = 'src/db/seeds/permissions.csv';

  public async run(dataSource: DataSource): Promise<void> {
    const data = await csvtojson().fromFile(this.csvFilePath);

    const insertData = data.map((obj) => ({
      id: parseInt(obj.id),
      action: obj.action,
      subject: obj.subject,
    }));

    await dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete(Permission, {});
      await transactionalEntityManager.save(Permission, insertData);
    });
  }
}
