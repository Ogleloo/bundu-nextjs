// ============================================================
// AUTH GUARD — wraps pages that require a logged-in customer
// Redirects to /auth/login if not authenticated.
// If the profile lookup fails outright we show a fallback with
// WhatsApp instead of redirecting — bouncing someone to login
// won't fix an unreachable database.
// Usage: wrap page content in <AuthGuard>{(profile) => ...}</AuthGuard>
// ============================================================
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ConnectionError from '@/components/UI/ConnectionError';
import type { Profile } from '@/types';

interface AuthGuardProps {
  children: (profile: Profile) => React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { profile, loading, failed, refresh } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !failed && !profile) {
      router.push('/auth/login');
    }
  }, [loading, failed, profile, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <p className="text-ink-soft text-sm">Loading...</p>
      </div>
    );
  }

  if (failed) {
    return (
      <ConnectionError
        message="We couldn't load your account just now, so the order form isn't available. Send us your order on WhatsApp and we'll sort it out."
        onRetry={refresh}
      />
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <p className="text-ink-soft text-sm">Redirecting to login...</p>
      </div>
    );
  }

  return <>{children(profile)}</>;
}
