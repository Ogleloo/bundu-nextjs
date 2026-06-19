// ============================================================
// EVENTS PAGE — /events (requires login)
// ============================================================
'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/UI/AuthGuard';
import EventsForm from '@/components/Home/EventsForm';

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1" style={{ backgroundColor: 'var(--paper)' }}>
        {/* Hero */}
        <div className="px-4 py-14 text-center border-b-4 border-double"
          style={{ backgroundColor: 'var(--burgundy)', borderColor: 'var(--kraft)' }}>
          <p className="font-script text-2xl mb-1" style={{ color: 'var(--chalk-yellow)' }}>
            good food, good vibes
          </p>
          <h1 className="font-display text-3xl md:text-4xl mb-3" style={{ color: 'var(--paper)' }}>
            Host Your Event at Bundu
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(244,237,220,0.75)' }}>
            Birthdays, corporate events, student gatherings — we have the
            space and the menu to make it unforgettable.
          </p>
        </div>

        {/* Form */}
        <div className="px-4 py-10">
          <AuthGuard>
            {(profile) => <EventsForm profile={profile} />}
          </AuthGuard>
        </div>
      </main>
      <Footer />
    </>
  );
}
