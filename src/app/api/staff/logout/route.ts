// ============================================================
// POST /api/staff/logout — clears the session cookie
// ============================================================
import { NextResponse } from 'next/server';
import { clearStaffSessionCookie } from '@/lib/staffSession';

export async function POST() {
  await clearStaffSessionCookie();
  return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
}
