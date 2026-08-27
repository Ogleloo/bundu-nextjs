// ============================================================
// POST /api/staff/toggle — owner-only. Activate/deactivate a
// staff member (one route, boolean flag — matches the existing
// toggleStaffActive shape).
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

  let body: { id?: string; active?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400, headers: NO_STORE });
  }

  if (!body.id || typeof body.active !== 'boolean') {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400, headers: NO_STORE });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('staff').update({ active: body.active }).eq('id', body.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400, headers: NO_STORE });
  }
  return NextResponse.json({ success: true }, { headers: NO_STORE });
}
