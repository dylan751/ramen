import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeCurrencyFromInvoiceItemsToInvoices1711360986654
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'currency',
        type: 'enum',
        enum: ['vnd', 'usd'],
      }),
    );
    await queryRunner.dropColumn('invoice_items', 'currency');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoices', 'currency');
    await queryRunner.addColumn(
      'invoice_items',
      new TableColumn({
        name: 'currency',
        type: 'enum',
        enum: ['vnd', 'usd'],
      }),
    );
  }
}
