import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddProjectIdAndCategoryIdToInvoices1712939240344
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'projectId',
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'categoryId',
        type: 'int',
        isNullable: true,
        default: null,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoices', 'projectId');
    await queryRunner.dropColumn('invoices', 'categoryId');
  }
}
