// ============================================================
// CATERING PAGE — /catering (requires login)
// ============================================================
'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/UI/AuthGuard';
import CateringForm from '@/components/Home/CateringForm';

export default function CateringPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1" style={{ backgroundColor: 'var(--paper)' }}>
        {/* Hero */}
        <div className="px-4 py-14 text-center border-b-4 border-double"
          style={{ backgroundColor: 'var(--moss)', borderColor: 'var(--kraft)' }}>
          <p className="font-script text-2xl mb-1" style={{ color: 'var(--chalk-yellow)' }}>
            for your next big event
          </p>
          <h1 className="font-display text-3xl md:text-4xl mb-3" style={{ color: 'var(--paper)' }}>
            Catering by Bundu Foods
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(244,237,220,0.75)' }}>
            From office lunches to large events — let us handle the food
            so you can focus on everything else.
          </p>
        </div>

        {/* Form */}
        <div className="px-4 py-10">
          <AuthGuard>
            {(profile) => <CateringForm profile={profile} />}
          </AuthGuard>
        </div>
      </main>
      <Footer />
    </>
  );
}
