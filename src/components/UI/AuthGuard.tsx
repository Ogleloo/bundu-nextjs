// ============================================================
// AUTH GUARD — wraps pages that require a logged-in customer
// Redirects to /auth/login if not authenticated.
// Usage: wrap page content in <AuthGuard>{(profile) => ...}</AuthGuard>
// ============================================================
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { Profile } from '@/types';

interface AuthGuardProps {
  children: (profile: Profile) => React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profile) {
      router.push('/auth/login');
    }
  }, [loading, profile, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <p className="text-ink-soft text-sm">Loading...</p>
      </div>
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
