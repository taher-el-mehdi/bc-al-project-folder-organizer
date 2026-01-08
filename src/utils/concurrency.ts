export async function limitConcurrency<T>(tasks: (() => Promise<T>)[], limit = 16): Promise<T[]> {
  const results: T[] = [];
  let idx = 0;
  async function worker() {
    while (idx < tasks.length) {
      const current = idx++;
      try {
        results[current] = await tasks[current]();
      } catch (err) {
        // propagate error to caller but keep processing others
        throw err;
      }
    }
  }
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.allSettled(workers);
  return results;
}
