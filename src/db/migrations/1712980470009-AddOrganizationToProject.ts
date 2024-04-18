import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOrganizationToProject1712980470009
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'projects',
      new TableColumn({
        name: 'organizationId',
        type: 'int',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('projects', 'organizationId');
  }
}
