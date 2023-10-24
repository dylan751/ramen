/**
 * Apply function to an array in batches.
 */
export async function batchProcess<T>(
  items: T[],
  batchSize: number,
  processFn: (chunk: T[]) => Promise<void>,
): Promise<void> {
  if (!items || items.length === 0) {
    return;
  }

  let chunk = [] as T[];

  for (let i = 0; i < items.length; i++) {
    chunk.push(items[i]);

    if (chunk.length === batchSize || i === items.length - 1) {
      await processFn(chunk);
      chunk = [];
    }
  }
}
