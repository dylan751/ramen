import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddInvoices1708954499706 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
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
            name: 'name',
            type: 'varchar',
            isUnique: false,
          },
          {
            name: 'note',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'amount',
            type: 'int',
            isNullable: true,
            default: null,
          },
          {
            name: 'date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['expense', 'income'],
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
    await queryRunner.dropTable('invoices');
  }
}
