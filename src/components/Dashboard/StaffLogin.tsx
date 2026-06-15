// ============================================================
// STAFF LOGIN — name selection + PIN entry for dashboard
// Used in src/app/dashboard/page.tsx
// ============================================================
'use client';

import { useState, useEffect } from 'react';
import { getActiveStaff, staffLogin } from '@/services/staffService';
import type { StaffMember } from '@/types';

interface StaffLoginProps {
  onLogin: (staff: StaffMember) => void;
}

export default function StaffLogin({ onLogin }: StaffLoginProps) {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getActiveStaff();
      setStaffList(data);
      setLoading(false);
    })();
  }, []);

  async function handleEnter(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedName) {
      setError('Please select your name first.');
      return;
    }
    const result = await staffLogin(selectedName, pin);
    if (!result.success) {
      setError(result.error || 'Incorrect PIN.');
      setPin('');
      return;
    }
    onLogin(result.staff!);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-chalk px-4 py-8">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-lg max-w-sm w-full p-8 text-center">
        <h2 className="font-display text-2xl text-paper">
          Bundu <span className="text-chalk-yellow italic">Foods</span>
        </h2>
        <p className="text-sm text-[#666] mt-1 mb-6">Staff Dashboard — Select your name then enter your PIN</p>

        {loading ? (
          <p className="text-sm text-[#666]">Loading staff list...</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 mb-5">
            {staffList.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => { setSelectedName(s.name); setError(''); }}
                className={`py-3 px-2 rounded border-[1.5px] text-sm font-semibold transition-colors ${
                  selectedName === s.name
                    ? 'border-chalk-yellow text-chalk-yellow bg-chalk-yellow/10'
                    : 'border-[#333] text-[#aaa] hover:border-[#555]'
                }`}
              >
                {s.role === 'owner' ? '👑 ' : '👤 '}{s.name}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleEnter}>
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            maxLength={6}
            placeholder="• • • •"
            className="w-full px-4 py-3 bg-[#1a1a1a] border-[1.5px] border-[#333] rounded text-paper text-center tracking-[4px] mb-3 outline-none focus:border-burgundy"
          />
          <button
            type="submit"
            className="w-full py-3 rounded text-sm font-semibold uppercase tracking-wide"
            style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}
          >
            Enter Dashboard
          </button>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </form>

        <a href="/" className="block mt-6 text-xs text-[#555] uppercase tracking-wide hover:text-paper">
          ← Back to site
        </a>
      </div>
    </div>
  );
}
