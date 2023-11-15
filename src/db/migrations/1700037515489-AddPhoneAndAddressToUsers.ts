import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPhoneAndAddressToUsers1700037515489
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'phone',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'address',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'avatar',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'phone');
    await queryRunner.dropColumn('users', 'address');
    await queryRunner.dropColumn('users', 'avatar');
  }
}
