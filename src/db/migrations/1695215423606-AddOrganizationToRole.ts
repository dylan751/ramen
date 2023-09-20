import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOrganizationToRole1695215423606 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'roles',
      new TableColumn({
        name: 'organizationId',
        type: 'int',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('roles', 'organizationId');
  }
}
