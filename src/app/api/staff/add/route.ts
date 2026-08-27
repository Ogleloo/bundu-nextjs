// ============================================================
// POST /api/staff/add — owner-only. Adds a new staff member.
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { requireOwner } from '@/lib/staffAuth';
import { createAdminClient } from '@/lib/supabase/admin';

const NO_STORE = { 'Cache-Control': 'no-store' };

export async function POST(request: NextRequest) {
  const owner = await requireOwner();
  if (!owner) {
    return NextResponse.json({ success: false, error: 'Not authorized.' }, { status: 401, headers: NO_STORE });
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
    return NextResponse.json({ success: false, error: 'Enter a name and PIN' }, { status: 400, headers: NO_STORE });
  }
  if (pin.length < 4) {
    return NextResponse.json({ success: false, error: 'PIN must be at least 4 digits' }, { status: 400, headers: NO_STORE });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('staff').insert({ name, pin, role: 'staff', active: true });

  if (error) {
    const message = error.message.includes('duplicate')
      ? 'A staff member with that name or PIN already exists'
      : error.message;
    return NextResponse.json({ success: false, error: message }, { status: 400, headers: NO_STORE });
  }

  return NextResponse.json({ success: true }, { headers: NO_STORE });
}
