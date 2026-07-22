/**
 * Client-side login attempt throttling.
 *
 * Tracks failed sign-in attempts per key (e.g. the login page route) in
 * localStorage and enforces a temporary lockout after MAX_ATTEMPTS failures.
 * This is a UX-level defence that slows down manual credential stuffing and
 * complements Supabase GoTrue's own server-side rate limiting.
 *
 * Keys stored:
 *   login_attempts:<key>        – number of consecutive failures
 *   login_lockout_until:<key>   – lockout expiry timestamp (ms)
 */

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function attemptsKey(key: string) {
  return `login_attempts:${key}`;
}
function lockoutKey(key: string) {
  return `login_lockout_until:${key}`;
}

/** Returns seconds remaining in lockout, or 0 if not locked out. */
export function getLockoutSeconds(key: string): number {
  try {
    const until = parseInt(localStorage.getItem(lockoutKey(key)) ?? "0", 10);
    const remaining = until - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  } catch {
    return 0;
  }
}

/** Call on every failed login attempt. Returns seconds remaining if now locked out, else 0. */
export function recordFailedAttempt(key: string): number {
  try {
    const lockoutUntil = parseInt(localStorage.getItem(lockoutKey(key)) ?? "0", 10);
    if (lockoutUntil > Date.now()) {
      return Math.ceil((lockoutUntil - Date.now()) / 1000);
    }

    const attempts = parseInt(localStorage.getItem(attemptsKey(key)) ?? "0", 10) + 1;
    localStorage.setItem(attemptsKey(key), String(attempts));

    if (attempts >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCKOUT_MS;
      localStorage.setItem(lockoutKey(key), String(until));
      localStorage.setItem(attemptsKey(key), "0");
      return Math.ceil(LOCKOUT_MS / 1000);
    }
  } catch {
    // localStorage not available (SSR, private browsing) — fail open
  }
  return 0;
}

/** Call on successful login to clear the counter. */
export function clearAttempts(key: string): void {
  try {
    localStorage.removeItem(attemptsKey(key));
    localStorage.removeItem(lockoutKey(key));
  } catch {
    // ignore
  }
}
