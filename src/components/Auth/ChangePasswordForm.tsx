// ============================================================
// CHANGE PASSWORD FORM
// Used in src/app/profile/page.tsx
// ============================================================
'use client';

import { useState } from 'react';
import { changePassword } from '@/services/authService';
import PasswordInput from '@/components/UI/PasswordInput';

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!current || !newPw || !confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPw.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPw !== confirm) {
      setError('New passwords do not match.');
      return;
    }

    setSubmitting(true);
    const result = await changePassword(current, newPw);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Could not change password.');
      return;
    }

    setSuccess(true);
    setCurrent(''); setNewPw(''); setConfirm('');
  }

  return (
    <div className="bg-white border border-kraft rounded-md p-6 md:p-8 max-w-md mx-auto">
      <h2 className="font-display text-xl mb-1">Change Password</h2>
      <p className="text-sm text-ink-soft mb-6">Enter your current password and choose a new one.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-3 py-2 rounded">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-300 text-green-700 text-sm px-3 py-2 rounded">
            ✓ Password changed successfully
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">Current Password</label>
          <PasswordInput value={current} onChange={setCurrent} placeholder="Current password" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">New Password</label>
          <PasswordInput value={newPw} onChange={setNewPw} placeholder="Min 6 characters" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">Confirm New Password</label>
          <PasswordInput value={confirm} onChange={setConfirm} placeholder="Repeat new password" />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded text-sm font-semibold uppercase tracking-wide disabled:opacity-60"
          style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}
        >
          {submitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
