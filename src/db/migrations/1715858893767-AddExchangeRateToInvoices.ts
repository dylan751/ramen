import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddExchangeRateToInvoices1715858893767
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'exchangeRate',
        type: 'int',
        isNullable: false,
        default: 1,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoices', 'exchangeRate');
  }
}
