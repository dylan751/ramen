import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddProjectTOCategory1713108690479 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'categories',
      new TableColumn({
        name: 'projectId',
        type: 'int',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('categories', 'projectId');
  }
}
