import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddUserOrganizationRoles1695881225858
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_organization_roles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isNullable: false,
            isGenerated: true,
            generationStrategy: 'increment', // auto increment
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'organizationId',
            type: 'int',
          },
          {
            name: 'roleId',
            type: 'int',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'NOW()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_organization_roles');
  }
}
