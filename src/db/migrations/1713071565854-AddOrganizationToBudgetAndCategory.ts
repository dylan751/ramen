import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOrganizationToBudgetAndCategory1713071565854
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'budgets',
      new TableColumn({
        name: 'organizationId',
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'categories',
      new TableColumn({
        name: 'organizationId',
        type: 'int',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('budgets', 'organizationId');
    await queryRunner.dropColumn('categories', 'organizationId');
  }
}
