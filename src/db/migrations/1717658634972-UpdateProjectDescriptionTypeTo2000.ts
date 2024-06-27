import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateProjectDescriptionTypeTo20001717658634972
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'projects', // Replace with your actual table name
      'description',
      new TableColumn({
        name: 'description',
        type: 'varchar',
        length: '2000',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'projects', // Replace with your actual table name
      'description',
      new TableColumn({
        name: 'description',
        type: 'varchar',
        length: '255', // Assuming the previous length was 255 or any other value
      }),
    );
  }
}
