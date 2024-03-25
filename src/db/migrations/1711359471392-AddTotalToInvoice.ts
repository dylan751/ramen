import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTotalToInvoice1711359471392 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'total',
        type: 'int',
        isNullable: true,
        default: null,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoices', 'total');
  }
}
