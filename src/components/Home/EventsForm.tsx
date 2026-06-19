// ============================================================
// EVENTS FORM — /events
// Saves to orders table with order_type: 'event'
// Appears on staff dashboard for follow-up
// ============================================================
'use client';

import { useState } from 'react';
import { submitOrder } from '@/services/orderService';
import type { Profile } from '@/types';

interface EventsFormProps {
  profile: Profile;
}

const EVENT_TYPES = [
  'Birthday Party',
  'Corporate Event',
  'Student Event',
  'Anniversary',
  'Other',
];

export default function EventsForm({ profile }: EventsFormProps) {
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!eventType || !eventDate || !guestCount) {
      setError('Please fill in the event type, date, and number of guests.');
      return;
    }

    setSubmitting(true);

    const orderDetails = [
      `Event Type: ${eventType}`,
      `Event Date: ${eventDate}`,
      `Number of Guests: ${guestCount}`,
      notes ? `Additional Notes: ${notes}` : null,
    ].filter(Boolean).join('\n');

    const result = await submitOrder(profile, {
      orderDetails,
      orderType: 'event',
      notes: '',
    });

    setSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Could not submit booking. Please try again.');
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-white border border-kraft rounded-md p-8 text-center max-w-xl mx-auto">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--ink)' }}>
          Booking Request Received!
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--ink-soft)' }}>
          We&apos;ll contact you within 24 hours to discuss your requirements.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2.5 rounded text-sm font-semibold uppercase tracking-wide"
          style={{ backgroundColor: 'var(--moss)', color: 'var(--paper)' }}
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white border border-kraft rounded-md p-6 md:p-8 max-w-xl mx-auto shadow-sm">
      <h2 className="font-display text-2xl mb-1" style={{ color: 'var(--ink)' }}>
        Book an Event
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--ink-soft)' }}>
        Tell us about your event and we&apos;ll get back to you within 24 hours.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-3 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pre-filled customer info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
              style={{ color: 'var(--ink-soft)' }}>Your Name</label>
            <div className="px-3 py-2.5 border rounded text-sm"
              style={{ borderColor: 'var(--paper-dark)', backgroundColor: 'var(--paper)', color: 'var(--ink-soft)' }}>
              {profile.name}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
              style={{ color: 'var(--ink-soft)' }}>WhatsApp</label>
            <div className="px-3 py-2.5 border rounded text-sm"
              style={{ borderColor: 'var(--paper-dark)', backgroundColor: 'var(--paper)', color: 'var(--ink-soft)' }}>
              0{profile.wa.slice(2)}
            </div>
          </div>
        </div>

        {/* Event type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: 'var(--ink-soft)' }}>Event Type *</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {EVENT_TYPES.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setEventType(type)}
                className="py-2.5 px-3 rounded border text-xs font-semibold transition-colors"
                style={{
                  borderColor: eventType === type ? 'var(--burgundy)' : 'var(--paper-dark)',
                  backgroundColor: eventType === type ? 'rgba(138,44,32,0.06)' : 'var(--paper)',
                  color: eventType === type ? 'var(--burgundy)' : 'var(--ink-soft)',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
              style={{ color: 'var(--ink-soft)' }}>Event Date *</label>
            <input
              type="date"
              value={eventDate}
              onChange={e => setEventDate(e.target.value)}
              className="w-full px-3 py-2.5 border rounded text-sm outline-none"
              style={{ borderColor: 'var(--paper-dark)', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
              style={{ color: 'var(--ink-soft)' }}>Number of Guests *</label>
            <input
              type="number"
              value={guestCount}
              onChange={e => setGuestCount(e.target.value)}
              placeholder="e.g. 30"
              min="1"
              className="w-full px-3 py-2.5 border rounded text-sm outline-none"
              style={{ borderColor: 'var(--paper-dark)', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: 'var(--ink-soft)' }}>Additional Notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. Theme, special requests, equipment needed..."
            className="w-full px-3 py-2.5 border rounded text-sm outline-none min-h-[80px]"
            style={{ borderColor: 'var(--paper-dark)', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded text-sm font-semibold uppercase tracking-wide transition-opacity disabled:opacity-60"
          style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}
        >
          {submitting ? 'Sending...' : 'Submit Booking Request'}
        </button>
      </form>
    </div>
  );
}
