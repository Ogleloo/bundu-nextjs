// ============================================================
// CATERING FORM — /catering
// Saves to orders table with order_type: 'catering'
// Appears on staff dashboard for follow-up
// ============================================================
'use client';

import { useState } from 'react';
import { submitOrder } from '@/services/orderService';
import type { Profile } from '@/types';

interface CateringFormProps {
  profile: Profile;
}

export default function CateringForm({ profile }: CateringFormProps) {
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [menuIdeas, setMenuIdeas] = useState('');
  const [requirements, setRequirements] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!eventDate || !guestCount || !menuIdeas) {
      setError('Please fill in the date, number of guests, and menu ideas.');
      return;
    }

    setSubmitting(true);

    // Build a detailed order description from the form fields
    const orderDetails = [
      `Event Date: ${eventDate}`,
      `Number of Guests: ${guestCount}`,
      `Menu Ideas: ${menuIdeas}`,
      requirements ? `Special Requirements: ${requirements}` : null,
    ].filter(Boolean).join('\n');

    const result = await submitOrder(profile, {
      orderDetails,
      orderType: 'catering',
      notes: '',
    });

    setSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Could not submit enquiry. Please try again.');
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-white border border-kraft rounded-md p-8 text-center max-w-xl mx-auto">
        <div className="text-5xl mb-3">🍴</div>
        <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--ink)' }}>Enquiry Received!</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--ink-soft)' }}>
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
      <h2 className="font-display text-2xl mb-1" style={{ color: 'var(--ink)' }}>Catering Enquiry</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--ink-soft)' }}>
        Tell us about your event and we&apos;ll put together a menu for you.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pre-filled */}
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
              placeholder="e.g. 50"
              min="1"
              className="w-full px-3 py-2.5 border rounded text-sm outline-none"
              style={{ borderColor: 'var(--paper-dark)', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: 'var(--ink-soft)' }}>Menu Ideas *</label>
          <textarea
            value={menuIdeas}
            onChange={e => setMenuIdeas(e.target.value)}
            placeholder="e.g. Breakfast spread, finger foods, braai, full sit-down dinner..."
            className="w-full px-3 py-2.5 border rounded text-sm outline-none min-h-[100px]"
            style={{ borderColor: 'var(--paper-dark)', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: 'var(--ink-soft)' }}>Special Requirements (optional)</label>
          <input
            type="text"
            value={requirements}
            onChange={e => setRequirements(e.target.value)}
            placeholder="e.g. Vegetarian options, halal, allergies..."
            className="w-full px-3 py-2.5 border rounded text-sm outline-none"
            style={{ borderColor: 'var(--paper-dark)', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded text-sm font-semibold uppercase tracking-wide transition-opacity disabled:opacity-60"
          style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}
        >
          {submitting ? 'Sending...' : 'Submit Catering Enquiry'}
        </button>
      </form>
    </div>
  );
}
