// ============================================================
// SUPABASE CLIENT (browser/client components)
// Used inside 'use client' components — e.g. forms, dashboard
// ============================================================
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
