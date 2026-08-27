import 'server-only';
// ============================================================
// SUPABASE ADMIN CLIENT — service role, bypasses RLS entirely
// Only ever import this from route handlers under src/app/api/.
// The 'server-only' import above makes it a build error to pull
// this into a Client Component or anything that could ship to
// the browser.
// ============================================================
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Supabase admin client misconfigured: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.'
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
