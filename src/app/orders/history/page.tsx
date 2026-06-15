// ============================================================
// MY ORDERS PAGE — /orders/history (requires login)
// ============================================================
'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/UI/AuthGuard';
import { OrderHistory } from '@/components/Orders';

export default function OrderHistoryPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper">
        <div className="bg-moss px-4 py-10 text-center border-b-2 border-kraft" style={{ backgroundColor: 'var(--moss)' }}>
          <AuthGuard>
            {(profile) => (
              <>
                <h1 className="font-display text-2xl md:text-3xl text-paper">
                  Hello, {profile.name.split(' ')[0]} 👋
                </h1>
                <p className="text-paper/70 text-sm mt-1">Track your Bundu Foods orders in real time</p>
              </>
            )}
          </AuthGuard>
        </div>

        <div className="px-4 py-8">
          <AuthGuard>
            {(profile) => <OrderHistory profile={profile} />}
          </AuthGuard>
        </div>
      </main>
      <Footer />
    </>
  );
}
