import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDateFormatToOrganization1717766452041
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('organizations', [
      new TableColumn({
        name: 'dateFormat',
        type: 'varchar',
        isNullable: false,
        default: '"dd/MM/yyyy"', // Have to use "" otherwise the migration will fail
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('organizations', 'dateFormat');
  }
}
