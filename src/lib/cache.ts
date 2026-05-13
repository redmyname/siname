interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Periodic cleanup every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now > entry.expiresAt) {
      cache.delete(key);
    }
  }
}, 600_000);

export function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCache(key: string, data: unknown): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL,
  });

  // Limit cache size to prevent memory leaks
  if (cache.size > 5000) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
}
