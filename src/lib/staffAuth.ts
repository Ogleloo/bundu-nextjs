import 'server-only';
// ============================================================
// STAFF AUTHORIZATION — verifies the session cookie, then
// re-reads the staff row from the DB rather than trusting the
// cookie's claims forever. A staff member deactivated (or an
// owner demoted) after logging in loses access on their very
// next request, not just when the cookie eventually expires.
// ============================================================
import { readStaffSession } from '@/lib/staffSession';
import { createAdminClient } from '@/lib/supabase/admin';
import type { StaffSummary } from '@/types';

/** The signed-in staff member, re-verified against the DB, or null. */
export async function getVerifiedStaff(): Promise<StaffSummary | null> {
  const session = await readStaffSession();
  if (!session) return null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('staff')
    .select('id, name, role, active, created_at')
    .eq('id', session.id)
    .single();

  if (error || !data || !data.active) return null;
  return data as StaffSummary;
}

/** The signed-in staff member, but only if they are an active owner. */
export async function requireOwner(): Promise<StaffSummary | null> {
  const staff = await getVerifiedStaff();
  if (!staff || staff.role !== 'owner') return null;
  return staff;
}
