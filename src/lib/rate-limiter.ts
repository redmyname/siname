interface RateEntry {
  count: number;
  resetAt: number;
}

const minuteLimit = new Map<string, RateEntry>();
const dailyLimit = new Map<string, RateEntry>();
const MAX_PER_MINUTE = 3;
const MAX_PER_DAY = 50;

function getClientId(ip: string, fingerprint?: string): string {
  return fingerprint ? `${ip}::${fingerprint}` : ip;
}

function cleanExpired(map: Map<string, RateEntry>) {
  const now = Date.now();
  for (const [key, entry] of map) {
    if (now > entry.resetAt) {
      map.delete(key);
    }
  }
}

export function checkRateLimit(
  ip: string,
  fingerprint?: string
): { allowed: boolean; remainingMinute: number; remainingDay: number } {
  const clientId = getClientId(ip, fingerprint);
  const now = Date.now();

  cleanExpired(minuteLimit);
  cleanExpired(dailyLimit);

  // Minute limit
  let minuteEntry = minuteLimit.get(clientId);
  if (!minuteEntry) {
    minuteEntry = { count: 0, resetAt: now + 60_000 };
    minuteLimit.set(clientId, minuteEntry);
  }
  const remainingMinute = Math.max(0, MAX_PER_MINUTE - minuteEntry.count);

  // Daily limit (reset at midnight UTC)
  let dailyEntry = dailyLimit.get(clientId);
  if (!dailyEntry) {
    const midnight = new Date();
    midnight.setUTCHours(24, 0, 0, 0);
    dailyEntry = { count: 0, resetAt: midnight.getTime() };
    dailyLimit.set(clientId, dailyEntry);
  }
  const remainingDay = Math.max(0, MAX_PER_DAY - dailyEntry.count);

  const allowed = minuteEntry.count < MAX_PER_MINUTE && dailyEntry.count < MAX_PER_DAY;

  if (allowed) {
    minuteEntry.count++;
    dailyEntry.count++;
  }

  return { allowed, remainingMinute: allowed ? remainingMinute - 1 : remainingMinute, remainingDay: allowed ? remainingDay - 1 : remainingDay };
}

// Periodic cleanup every 5 minutes
setInterval(() => {
  cleanExpired(minuteLimit);
  cleanExpired(dailyLimit);
}, 300_000);
