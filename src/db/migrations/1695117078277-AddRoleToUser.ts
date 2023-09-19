import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRoleToUser1695117078277 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'roleId',
        type: 'int',
        default: 1, //at this time, user is the admin of organization in default
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'roleId');
  }
}
