// ============================================================
// GET /api/staff/list — public. Active staff for the /staff-login
// name grid. id + name + role only — pin is never selected.
// ============================================================
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('staff')
    .select('id, name, role, active, created_at')
    .eq('active', true)
    .order('role', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
  return NextResponse.json({ success: true, staff: data }, { headers: { 'Cache-Control': 'no-store' } });
}
