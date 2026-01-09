// utils/retry.ts
import { delay } from './delay';

export async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  wait = 300
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < retries - 1) {
        await delay(wait);
      }
    }
  }

  throw lastError;
}
