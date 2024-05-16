import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPhoneAndAddressToOrganizations1715074543844
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('organizations', [
      new TableColumn({
        name: 'phone',
        type: 'varchar',
        isNullable: true,
        default: null,
      }),
      new TableColumn({
        name: 'address',
        type: 'varchar',
        isNullable: true,
        default: null,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('organizations', 'phone');
    await queryRunner.dropColumn('organizations', 'address');
  }
}
