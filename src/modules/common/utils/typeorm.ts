import { EntityManager, ObjectLiteral, Repository } from 'typeorm';
import { batchProcess } from './batch';

/**
 * Efficient TypeORM insertion in batches.
 * By default TypeORM does entity reloading after the insertions (by issuing additional SELEÇT), which in some cases unnecessary and bad for performance.
 * This method skip the reloading part but you need to be careful if you plan to use the entity afterward.
 */
export async function batchInsertWithoutEntityReload<T extends ObjectLiteral>(
  executor: Repository<T> | EntityManager,
  entities: T[],
  batchSize = 1000,
  orUpdateOrIgnore?: {
    orUpdate?: { overwrite: string[] };
    orIgnore?: string | boolean;
  },
): Promise<void> {
  return batchProcess(entities, batchSize, async (chunk) => {
    const entityTarget = chunk[0].constructor;
    const qb = executor
      .createQueryBuilder()
      .insert()
      .into(entityTarget)
      .values(chunk)
      .updateEntity(false);
    if (orUpdateOrIgnore && orUpdateOrIgnore.orUpdate) {
      // overwrites the specified columns if there is a duplicate on primary key or unique index, with INSERT ... ON DUPLICATE KEY UPDATE Statement
      // https://dev.mysql.com/doc/refman/8.0/en/insert-on-duplicate.html
      qb.orUpdate(orUpdateOrIgnore.orUpdate.overwrite);
    }

    if (orUpdateOrIgnore && orUpdateOrIgnore.orIgnore) {
      qb.orIgnore(orUpdateOrIgnore.orIgnore);
    }

    await qb.execute();
  });
}

/**
 * TypeORM save in batches.
 */
export async function batchSave<T extends ObjectLiteral>(
  executor: Repository<T> | EntityManager,
  entities: T[],
  batchSize = 1000,
): Promise<void> {
  return batchProcess(entities, batchSize, async (chunk) => {
    const entityTarget = chunk[0].constructor;
    await (executor instanceof EntityManager
      ? executor.save(entityTarget, chunk)
      : executor.save(chunk));
  });
}
