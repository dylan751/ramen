import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePermissionObjectToSubject1698233111356
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE permissions RENAME COLUMN object TO subject',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE permissions RENAME COLUMN subject TO object',
    );
  }
}
