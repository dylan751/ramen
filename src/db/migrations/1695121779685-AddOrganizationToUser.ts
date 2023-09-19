import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOrganizationToUser1695121779685 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'organizationId',
        type: 'int',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'organizationId');
  }
}
