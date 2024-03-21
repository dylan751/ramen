import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveNameNoteAmountTypeInInvoices1710753761136
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoices', 'name');
    await queryRunner.dropColumn('invoices', 'note');
    await queryRunner.dropColumn('invoices', 'amount');
    await queryRunner.dropColumn('invoices', 'type');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'name',
        type: 'varchar',
      }),
    );
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'note',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'amount',
        type: 'int',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['expense', 'income'],
      }),
    );
  }
}
