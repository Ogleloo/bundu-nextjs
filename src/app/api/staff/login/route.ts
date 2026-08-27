// ============================================================
// POST /api/staff/login
// Verifies name+PIN server-side against the staff table using
// the service role key. PINs never leave the server: this route
// never returns the pin, and it is never logged below.
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { setStaffSessionCookie } from '@/lib/staffSession';
import { checkLoginRateLimit, recordFailedLogin, clearLoginAttempts } from '@/lib/staffLoginRateLimit';

const NO_STORE = { 'Cache-Control': 'no-store' };

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const retryAfter = checkLoginRateLimit(ip);
  if (retryAfter !== null) {
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Try again in a few minutes.' },
      { status: 429, headers: { ...NO_STORE, 'Retry-After': String(retryAfter) } }
    );
  }

  let body: { name?: string; pin?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400, headers: NO_STORE });
  }

  const name = body.name?.trim();
  const pin = body.pin?.trim();
  if (!name || !pin) {
    return NextResponse.json({ success: false, error: 'Name and PIN are required.' }, { status: 400, headers: NO_STORE });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('staff')
    .select('id, name, role')
    .eq('name', name)
    .eq('pin', pin)
    .eq('active', true)
    .single();

  if (error || !data) {
    recordFailedLogin(ip);
    return NextResponse.json({ success: false, error: 'Incorrect PIN. Try again.' }, { status: 401, headers: NO_STORE });
  }

  clearLoginAttempts(ip);
  await setStaffSessionCookie(data.id, data.role);

  return NextResponse.json(
    { success: true, staff: { id: data.id, name: data.name, role: data.role } },
    { headers: NO_STORE }
  );
}
