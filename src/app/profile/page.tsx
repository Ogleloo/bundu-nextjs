// ============================================================
// PROFILE PAGE — /profile (requires login)
// Tabs: My Details | Change Password
// Tab can be pre-selected via ?tab=password (used by Navbar dropdown)
// ============================================================
'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/UI/AuthGuard';
import { ProfileDetails, ChangePasswordForm } from '@/components/Auth';
import { useAuth } from '@/hooks/useAuth';

function ProfileContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'password' ? 'password' : 'details';
  const [tab, setTab] = useState<'details' | 'password'>(initialTab);
  const { refresh } = useAuth();

  return (
    <main className="flex-1 bg-paper">
      <div className="bg-burgundy px-4 py-10 text-center border-b-4 border-double border-kraft">
        <h1 className="font-display text-2xl md:text-3xl text-paper">My Details</h1>
        <p className="text-paper/70 text-sm mt-1">Manage your account information</p>
      </div>

      <div className="px-4 py-8">
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setTab('details')}
            className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wide border transition-colors ${
              tab === 'details' ? 'bg-burgundy border-burgundy text-paper' : 'border-kraft text-ink-soft'
            }`}
          >
            👤 My Details
          </button>
          <button
            onClick={() => setTab('password')}
            className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wide border transition-colors ${
              tab === 'password' ? 'bg-burgundy border-burgundy text-paper' : 'border-kraft text-ink-soft'
            }`}
          >
            🔑 Change Password
          </button>
        </div>

        <AuthGuard>
          {(profile) =>
            tab === 'details' ? (
              <ProfileDetails profile={profile} onSaved={refresh} />
            ) : (
              <ChangePasswordForm />
            )
          }
        </AuthGuard>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="flex-1 py-24 text-center text-ink-soft">Loading...</div>}>
        <ProfileContent />
      </Suspense>
      <Footer />
    </>
  );
}
