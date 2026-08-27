// ============================================================
// GET /api/staff/all — owner-only. All staff (active + inactive)
// for the management panel. pin is never selected here either.
// ============================================================
import { NextResponse } from 'next/server';
import { requireOwner } from '@/lib/staffAuth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const owner = await requireOwner();
  if (!owner) {
    return NextResponse.json({ success: false, error: 'Not authorized.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('staff')
    .select('id, name, role, active, created_at')
    .order('role', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
  return NextResponse.json({ success: true, staff: data }, { headers: { 'Cache-Control': 'no-store' } });
}
