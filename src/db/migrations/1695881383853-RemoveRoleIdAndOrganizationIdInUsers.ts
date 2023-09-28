import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveRoleIdAndOrganizationIdInUsers1695881383853
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'roleId');
    await queryRunner.dropColumn('users', 'organizationId');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'roleId',
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'organizationId',
        type: 'int',
      }),
    );
  }
}
