// ============================================================
// STAFF MANAGEMENT — Owner-only panel to add/activate/remove staff
// Used in src/app/dashboard/page.tsx when staff.role === 'owner'
// ============================================================
'use client';

import { useState, useEffect } from 'react';
import { getAllStaff, addStaffMember, toggleStaffActive, removeStaffMember } from '@/services/staffService';
import type { StaffMember } from '@/types';

export default function StaffManagement() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [newName, setNewName] = useState('');
  const [newPin, setNewPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await getAllStaff();
    setStaffList(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    setError('');
    const result = await addStaffMember(newName, newPin);
    if (!result.success) {
      setError(result.error || 'Could not add staff member.');
      return;
    }
    setNewName('');
    setNewPin('');
    load();
  }

  async function handleToggle(s: StaffMember) {
    await toggleStaffActive(s.id, !s.active);
    load();
  }

  async function handleRemove(s: StaffMember) {
    if (!confirm(`Remove ${s.name} from staff?`)) return;
    await removeStaffMember(s.id);
    load();
  }

  return (
    <div className="bg-[#0d0d0d] border-t border-[#1a1a1a] px-4 md:px-8 py-6">
      <p className="text-[10px] font-bold uppercase tracking-widest text-chalk-yellow mb-4">
        ⚙️ Staff Management — Owner Panel
      </p>

      {loading ? (
        <p className="text-sm text-[#666]">Loading staff...</p>
      ) : (
        <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {staffList.map(s => (
            <div key={s.id} className={`bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-3 flex items-center justify-between ${s.active ? '' : 'opacity-40'}`}>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-paper">{s.role === 'owner' ? '👑 ' : '👤 '}{s.name}</span>
                <span className="font-script text-base text-chalk-yellow">PIN: {s.pin}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded ${s.active ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                  {s.active ? 'Active' : 'Off'}
                </span>
                {s.role !== 'owner' && (
                  <>
                    <button onClick={() => handleToggle(s)} className="text-[11px] px-2 py-1 rounded border border-[#333] text-[#888] hover:border-[#555] hover:text-paper transition-colors">
                      {s.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleRemove(s)} className="text-[11px] px-2 py-1 rounded border border-[#3a0a0a] text-red-400 hover:bg-[#2a0505] transition-colors">
                      ✕
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Staff name"
          className="bg-[#1a1a1a] border border-[#333] text-paper text-sm px-3 py-2 rounded outline-none focus:border-chalk-yellow"
        />
        <input
          type="text"
          value={newPin}
          onChange={e => setNewPin(e.target.value)}
          placeholder="PIN (4-6 digits)"
          maxLength={6}
          className="bg-[#1a1a1a] border border-[#333] text-paper text-sm px-3 py-2 rounded outline-none focus:border-chalk-yellow w-32"
        />
        <button
          onClick={handleAdd}
          className="bg-moss text-paper text-sm font-semibold px-4 py-2 rounded hover:bg-moss-deep transition-colors"
          style={{ backgroundColor: 'var(--moss)' }}
        >
          + Add Staff
        </button>
      </div>
    </div>
  );
}
