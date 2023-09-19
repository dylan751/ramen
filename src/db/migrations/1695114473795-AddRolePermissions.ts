import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class AddRolePermissions1695114473795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'role_permissions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'roleId',
            type: 'int',
          },
          {
            name: 'permissionId',
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
            onUpdate: 'NOW()',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'role_permissions',
      new TableIndex({
        name: 'IDX_RoleIdPermissionIdOnRolePermissions',
        columnNames: ['roleId', 'permissionId'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'role_permissions',
      new TableIndex({
        name: 'IDX_PermissionIdOnRolePermissions',
        columnNames: ['permissionId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role_permissions');
  }
}
