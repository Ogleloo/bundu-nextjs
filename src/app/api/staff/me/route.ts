// ============================================================
// GET /api/staff/me — who does the current session cookie
// belong to, re-verified against the DB right now (not just
// the cookie's claims). Replaces the sessionStorage check that
// used to live in dashboard/page.tsx.
// ============================================================
import { NextResponse } from 'next/server';
import { getVerifiedStaff } from '@/lib/staffAuth';

export async function GET() {
  const staff = await getVerifiedStaff();
  if (!staff) {
    return NextResponse.json({ success: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
  return NextResponse.json({ success: true, staff }, { headers: { 'Cache-Control': 'no-store' } });
}
