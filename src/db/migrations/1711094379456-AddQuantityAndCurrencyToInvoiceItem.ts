import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddQuantityAndCurrencyToInvoiceItem1711094379456
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invoice_items',
      new TableColumn({
        name: 'currency',
        type: 'enum',
        enum: ['vnd', 'usd'],
      }),
    );
    await queryRunner.addColumn(
      'invoice_items',
      new TableColumn({
        name: 'quantity',
        type: 'int',
        isNullable: false,
        default: 1,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoice_items', 'currency');
    await queryRunner.dropColumn('invoice_items', 'quantity');
  }
}
