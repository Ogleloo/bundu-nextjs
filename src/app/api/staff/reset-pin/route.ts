// ============================================================
// POST /api/staff/reset-pin — owner-only. Generates a new random
// 4-digit PIN and writes it, replacing the old one.
//
// Deliberate exception to "PINs never leave the server": this
// response includes the freshly-generated PIN, exactly once, so
// the owner can see and record it — the whole point of the
// reveal-once UI. It is never logged anywhere below, and the
// response is marked no-store so it is never cached.
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

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400, headers: NO_STORE });
  }

  if (!body.id) {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400, headers: NO_STORE });
  }

  const newPin = Math.floor(1000 + Math.random() * 9000).toString();

  const supabase = createAdminClient();
  const { error } = await supabase.from('staff').update({ pin: newPin }).eq('id', body.id);

  if (error) {
    // Do not include newPin here or anywhere else in this file.
    return NextResponse.json({ success: false, error: error.message }, { status: 400, headers: NO_STORE });
  }

  return NextResponse.json({ success: true, pin: newPin }, { headers: NO_STORE });
}
