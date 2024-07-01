import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCurrencyToOrganization1719825197059
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('organizations', [
      new TableColumn({
        name: 'currency',
        type: 'enum',
        enum: ['vnd', 'usd'],
        isNullable: false,
        default: '"usd"',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('organizations', 'currency');
  }
}
