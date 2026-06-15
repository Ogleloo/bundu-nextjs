// ============================================================
// useAuth — current logged-in user/profile state
// Usage: const { profile, loading, refresh } = useAuth();
// ============================================================
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCurrentProfile } from '@/services/authService';
import type { Profile } from '@/types';

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const p = await getCurrentProfile();
    setProfile(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    const supabase = createClient();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [refresh]);

  return { profile, loading, refresh };
}
