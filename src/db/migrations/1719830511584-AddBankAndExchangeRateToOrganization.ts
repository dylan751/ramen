import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddBankAndExchangeRateToOrganization1719830511584
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('organizations', [
      new TableColumn({
        name: 'bank',
        type: 'enum',
        enum: ['bidv', 'vcb'],
        isNullable: false,
        default: '"bidv"',
      }),
      new TableColumn({
        name: 'exchangeRate',
        type: 'int',
        isNullable: false,
        default: 25464,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('organizations', 'bank');
    await queryRunner.dropColumn('organizations', 'exchangeRate');
  }
}
