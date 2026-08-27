import 'server-only';
// ============================================================
// STAFF SESSION COOKIE — signed, httpOnly, never contains a PIN
// Sign/verify only. Authorization checks (is this staff member
// still an active owner?) live in src/lib/staffAuth.ts, which
// re-reads the DB rather than trusting these claims forever.
// ============================================================
import crypto from 'crypto';
import { cookies } from 'next/headers';
import type { StaffRole } from '@/types';

const COOKIE_NAME = 'bundu_staff_session';
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours — a work shift

export interface StaffSessionClaims {
  id: string;
  role: StaffRole;
  iat: number; // unix seconds, checked against MAX_AGE_SECONDS on verify
}

function getSecret(): string {
  const secret = process.env.STAFF_SESSION_SECRET;
  if (!secret) throw new Error('STAFF_SESSION_SECRET is not set');
  return secret;
}

function sign(payloadB64: string): string {
  return crypto.createHmac('sha256', getSecret()).update(payloadB64).digest('base64url');
}

function encode(id: string, role: StaffRole): string {
  const claims: StaffSessionClaims = { id, role, iat: Math.floor(Date.now() / 1000) };
  const payloadB64 = Buffer.from(JSON.stringify(claims)).toString('base64url');
  return `${payloadB64}.${sign(payloadB64)}`;
}

/** Verify a raw cookie value. Returns the claims if valid and unexpired, else null. */
export function verifySessionValue(value: string | undefined | null): StaffSessionClaims | null {
  if (!value) return null;
  const [payloadB64, signature] = value.split('.');
  if (!payloadB64 || !signature) return null;

  const expected = sign(payloadB64);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  let claims: StaffSessionClaims;
  try {
    claims = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  const ageSeconds = Math.floor(Date.now() / 1000) - claims.iat;
  if (ageSeconds < 0 || ageSeconds > MAX_AGE_SECONDS) return null; // expired or clock-skew nonsense

  return claims;
}

/** Set the signed session cookie. Call only from a route handler. */
export async function setStaffSessionCookie(id: string, role: StaffRole) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encode(id, role), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Clear the session cookie. Call only from a route handler. */
export async function clearStaffSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Read + verify the session cookie from the current request. */
export async function readStaffSession(): Promise<StaffSessionClaims | null> {
  const cookieStore = await cookies();
  return verifySessionValue(cookieStore.get(COOKIE_NAME)?.value);
}
