import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOrganizationToInvoice1708957181600
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'organizationId',
        type: 'int',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoices', 'organizationId');
  }
}
