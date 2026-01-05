export function createLimiter(concurrency: number) {
  let active = 0;
  const queue: Array<() => void> = [];

  const tryRunNext = () => {
    if (active >= concurrency) return;
    const job = queue.shift();
    if (!job) return;
    active += 1;
    job();
  };

  return async function limit<T>(task: () => Promise<T>): Promise<T> {
    return await new Promise<T>((resolve, reject) => {
      queue.push(async () => {
        try {
          resolve(await task());
        } catch (e) {
          reject(e);
        } finally {
          active -= 1;
          tryRunNext();
        }
      });
      tryRunNext();
    });
  };
}
