// ============================================================
// PROFILE DETAILS — edit name + WhatsApp number
// Used in src/app/profile/page.tsx
// ============================================================
'use client';

import { useState } from 'react';
import { updateProfile, isValidSAWhatsApp } from '@/services/authService';
import type { Profile } from '@/types';

interface ProfileDetailsProps {
  profile: Profile;
  onSaved: () => void;
}

export default function ProfileDetails({ profile, onSaved }: ProfileDetailsProps) {
  const [name, setName] = useState(profile.name);
  const [wa, setWa] = useState('0' + profile.wa.slice(2));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaved(false);

    if (!name.trim() || !wa.trim()) {
      setError('Name and WhatsApp number are required.');
      return;
    }
    if (!isValidSAWhatsApp(wa)) {
      setError('Please enter a valid SA WhatsApp number.');
      return;
    }

    setSubmitting(true);
    const result = await updateProfile(profile.id, { name, wa });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Could not save changes.');
      return;
    }

    setSaved(true);
    onSaved();
  }

  return (
    <div className="bg-white border border-kraft rounded-md p-6 md:p-8 max-w-md mx-auto">
      <h2 className="font-display text-xl mb-1">Account Information</h2>
      <p className="text-sm text-ink-soft mb-6">Update your details below.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-3 py-2 rounded">{error}</div>
        )}
        {saved && (
          <div className="bg-green-50 border border-green-300 text-green-700 text-sm px-3 py-2 rounded">
            ✓ Details updated successfully
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2.5 border border-paper-dark rounded text-sm bg-paper focus:border-burgundy focus:bg-white outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">Email Address</label>
          <input
            type="email"
            value={profile.email}
            readOnly
            title="Email cannot be changed"
            className="w-full px-3 py-2.5 border border-paper-dark rounded text-sm bg-paper-dark text-ink-soft cursor-not-allowed opacity-70"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">WhatsApp Number</label>
          <input
            type="tel"
            value={wa}
            onChange={e => setWa(e.target.value)}
            placeholder="073 123 4567"
            className="w-full px-3 py-2.5 border border-paper-dark rounded text-sm bg-paper focus:border-burgundy focus:bg-white outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded text-sm font-semibold uppercase tracking-wide disabled:opacity-60"
          style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
