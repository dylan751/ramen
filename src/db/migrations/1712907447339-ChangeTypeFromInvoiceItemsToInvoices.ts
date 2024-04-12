import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeTypeFromInvoiceItemsToInvoices1712907447339
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['expense', 'income'],
      }),
    );
    await queryRunner.dropColumn('invoice_items', 'type');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoices', 'type');
    await queryRunner.addColumn(
      'invoice_items',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['expense', 'income'],
      }),
    );
  }
}
