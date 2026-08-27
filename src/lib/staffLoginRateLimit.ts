import 'server-only';
// ============================================================
// LOGIN RATE LIMITING — per-IP, in-memory
// A 4-digit PIN is 10,000 combinations, brute-forceable in
// seconds against an unthrottled endpoint. Locks an IP out for a
// few minutes after too many failed attempts in a row.
//
// In-memory means this resets on every redeploy/cold start, and
// isn't shared across serverless instances. Fine for now given
// this app's scale — swap for a shared store (Redis, Upstash,
// Supabase table) if that ever stops being true.
// ============================================================

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000;   // failed attempts older than this don't count
const LOCKOUT_MS = 5 * 60 * 1000;  // how long an IP is locked out once triggered

interface Entry {
  count: number;
  firstAttemptAt: number;
  lockedUntil: number;
}

const attempts = new Map<string, Entry>();

/** Opportunistic cleanup so this doesn't grow unbounded over a long-running process. */
function prune() {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (entry.lockedUntil < now && now - entry.firstAttemptAt > WINDOW_MS) {
      attempts.delete(key);
    }
  }
}

/** Returns seconds remaining if this key is currently locked out, else null. */
export function checkLoginRateLimit(key: string): number | null {
  prune();
  const entry = attempts.get(key);
  if (!entry) return null;
  const now = Date.now();
  if (entry.lockedUntil > now) return Math.ceil((entry.lockedUntil - now) / 1000);
  return null;
}

export function recordFailedLogin(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: now, lockedUntil: 0 });
    return;
  }

  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
  }
}

export function clearLoginAttempts(key: string) {
  attempts.delete(key);
}
