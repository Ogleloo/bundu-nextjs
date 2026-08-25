// ============================================================
// useAuth — current logged-in user/profile state
// Usage: const { profile, loading, failed, refresh } = useAuth();
// `failed` means the profile lookup errored (e.g. Supabase
// unreachable) rather than the visitor being signed out.
// ============================================================
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCurrentProfile } from '@/services/authService';
import type { Profile } from '@/types';

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    try {
      const p = await getCurrentProfile();
      setProfile(p);
      setFailed(false);
    } catch (err) {
      // Previously this rejection escaped and left loading stuck on true,
      // so the page sat forever on "Loading...".
      console.warn('[useAuth] profile lookup failed:', err);
      setProfile(null);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Re-check the session. Goes back to loading first — without that a
   * retry would briefly read as "not signed in" and AuthGuard would
   * bounce the visitor to /auth/login mid-refresh.
   */
  const refresh = useCallback(() => {
    setLoading(true);
    setFailed(false);
    return load();
  }, [load]);

  useEffect(() => {
    load();

    const supabase = createClient();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [load]);

  return { profile, loading, failed, refresh };
}
