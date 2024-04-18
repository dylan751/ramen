import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCreatorToProject1713431816238 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'projects',
      new TableColumn({
        name: 'creatorId',
        type: 'int',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('projects', 'creatorId');
  }
}
