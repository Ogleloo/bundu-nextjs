// ============================================================
// EVENTS PAGE — /events (public, no login required)
// Shows upcoming Bundu Foods events with posters
// Events added by GTS Captures Studios via Supabase Table Editor
// ============================================================
'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getEvents, type BunduEvent } from '@/services/eventsService';
import FloatingButtons from '@/components/UI/FloatingButtons';

export default function EventsPage() {
  const [events, setEvents] = useState<BunduEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getEvents();
      setEvents(data);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1" style={{ backgroundColor: 'var(--paper)' }}>

        {/* Hero */}
        <div className="px-4 py-14 text-center border-b-4 border-double"
          style={{ backgroundColor: 'var(--chalk-bg)', borderColor: 'var(--kraft)' }}>
          <p className="font-script text-2xl mb-1" style={{ color: 'var(--chalk-yellow)' }}>
            good food, good vibes
          </p>
          <h1 className="font-display text-3xl md:text-4xl mb-3" style={{ color: 'var(--paper)' }}>
            Upcoming Events
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(244,237,220,0.65)' }}>
            Bashes, live artists, and good times at Bundu Foods. Stay tuned for what&apos;s coming.
          </p>
        </div>

        {/* Events list */}
        <div className="px-4 py-12 max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <p className="font-script text-2xl" style={{ color: 'var(--ink-soft)' }}>
                loading events...
              </p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🎵</div>
              <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--ink)' }}>
                No events yet
              </h2>
              <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                Check back soon — something is always cooking at Bundu.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>

      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

function EventCard({ event }: { event: BunduEvent }) {
  const date = new Date(event.event_date).toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="rounded-md overflow-hidden border"
      style={{ borderColor: 'var(--kraft)', backgroundColor: 'white' }}>

      {/* Poster */}
      {event.poster_url ? (
        <img
          src={event.poster_url}
          alt={event.title}
          className="w-full object-cover"
          style={{ maxHeight: '400px' }}
        />
      ) : (
        <div className="w-full flex items-center justify-center py-16"
          style={{ backgroundColor: 'var(--chalk-bg)' }}>
          <div className="text-center">
            <div className="text-5xl mb-2">🎉</div>
            <p className="font-script text-xl" style={{ color: 'var(--chalk-yellow)' }}>
              poster coming soon
            </p>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: 'var(--burgundy)' }}>
          📅 {date}
        </p>
        <h2 className="font-display text-xl mb-2" style={{ color: 'var(--ink)' }}>
          {event.title}
        </h2>
        {event.description && (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}
