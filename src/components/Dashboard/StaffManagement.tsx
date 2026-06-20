// ============================================================
// STAFF MANAGEMENT + EVENT NOTIFICATIONS — Owner panel
// Manage staff PINs and notify all customers about events
// ============================================================
'use client';

import { useState, useEffect } from 'react';
import { getAllStaff, addStaffMember, toggleStaffActive, removeStaffMember } from '@/services/staffService';
import { getAllCustomerWhatsApps } from '@/services/eventsService';
import type { StaffMember } from '@/types';

export default function StaffManagement() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [newName, setNewName] = useState('');
  const [newPin, setNewPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Event notification
  const [eventMsg, setEventMsg] = useState('');
  const [customerCount, setCustomerCount] = useState(0);
  const [customers, setCustomers] = useState<{ name: string; wa: string }[]>([]);
  const [notifyIndex, setNotifyIndex] = useState<number | null>(null);

  async function load() {
    const [staffData, customerData] = await Promise.all([
      getAllStaff(),
      getAllCustomerWhatsApps(),
    ]);
    setStaffList(staffData);
    setCustomers(customerData);
    setCustomerCount(customerData.length);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    setError('');
    const result = await addStaffMember(newName, newPin);
    if (!result.success) { setError(result.error || 'Could not add staff member.'); return; }
    setNewName(''); setNewPin('');
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

  // Send WhatsApp notification to next customer in list
  function sendNextNotification() {
    if (!eventMsg.trim()) return;
    if (notifyIndex === null) {
      setNotifyIndex(0);
      return;
    }
    const next = notifyIndex + 1;
    if (next >= customers.length) {
      setNotifyIndex(null);
      alert(`✓ All ${customers.length} customers notified!`);
      return;
    }
    setNotifyIndex(next);
  }

  // When notifyIndex changes, open WhatsApp for that customer
  useEffect(() => {
    if (notifyIndex === null || customers.length === 0) return;
    const customer = customers[notifyIndex];
    if (!customer) return;
    const msg = encodeURIComponent(
      `Hi ${customer.name}! 🎉 ${eventMsg}\n\nSee you at Bundu Foods! 🍳`
    );
    window.open(`https://wa.me/${customer.wa}?text=${msg}`, '_blank');
  }, [notifyIndex]);

  return (
    <div style={{ backgroundColor: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}
      className="px-4 md:px-8 py-8 space-y-10">

      {/* ---- EVENT NOTIFICATIONS ---- */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-4"
          style={{ color: 'var(--chalk-yellow)' }}>
          📢 Notify Customers About an Event
        </p>
        <p className="text-xs mb-3" style={{ color: '#666' }}>
          {customerCount} registered customer{customerCount !== 1 ? 's' : ''} in the system.
          WhatsApp will open for each one — tap send, then come back and click Next.
        </p>

        <textarea
          value={eventMsg}
          onChange={e => setEventMsg(e.target.value)}
          placeholder="e.g. We're hosting a bash on 15 July featuring DJ Khula! Come through from 8PM 🔥"
          className="w-full px-3 py-2.5 rounded text-sm outline-none min-h-[80px] mb-3"
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            color: 'var(--paper)',
          }}
        />

        {notifyIndex === null ? (
          <button
            onClick={() => { if (customers.length > 0 && eventMsg.trim()) setNotifyIndex(0); }}
            disabled={!eventMsg.trim() || customers.length === 0}
            className="px-4 py-2.5 rounded text-sm font-semibold uppercase tracking-wide disabled:opacity-40 transition-colors"
            style={{ backgroundColor: 'var(--moss)', color: 'var(--paper)' }}
          >
            📲 Start Notifying Customers
          </button>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-sm" style={{ color: 'var(--chalk-yellow)' }}>
              Sent to {notifyIndex} of {customers.length} customers
            </div>
            <button
              onClick={sendNextNotification}
              className="px-4 py-2.5 rounded text-sm font-semibold uppercase tracking-wide transition-colors"
              style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}
            >
              {notifyIndex < customers.length - 1 ? '→ Next Customer' : '✓ Done'}
            </button>
            <button
              onClick={() => setNotifyIndex(null)}
              className="px-3 py-2.5 rounded text-xs border"
              style={{ borderColor: '#333', color: '#888' }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* ---- STAFF MANAGEMENT ---- */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-4"
          style={{ color: 'var(--chalk-yellow)' }}>
          ⚙️ Staff Management
        </p>

        {loading ? (
          <p className="text-sm" style={{ color: '#666' }}>Loading staff...</p>
        ) : (
          <div className="grid gap-3 mb-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {staffList.map(s => (
              <div key={s.id}
                className={`rounded px-4 py-3 flex items-center justify-between ${!s.active ? 'opacity-40' : ''}`}
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold" style={{ color: 'var(--paper)' }}>
                    {s.role === 'owner' ? '👑 ' : '👤 '}{s.name}
                  </span>
                  <span className="font-script text-base" style={{ color: 'var(--chalk-yellow)' }}>
                    PIN: {s.pin}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded ${
                    s.active ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                  }`}>
                    {s.active ? 'Active' : 'Off'}
                  </span>
                  {s.role !== 'owner' && (
                    <>
                      <button onClick={() => handleToggle(s)}
                        className="text-[11px] px-2 py-1 rounded border transition-colors"
                        style={{ borderColor: '#333', color: '#888' }}>
                        {s.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleRemove(s)}
                        className="text-[11px] px-2 py-1 rounded border transition-colors"
                        style={{ borderColor: '#3a0a0a', color: '#f87171' }}>
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
            className="px-3 py-2 rounded text-sm outline-none"
            style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: 'var(--paper)' }}
          />
          <input
            type="text"
            value={newPin}
            onChange={e => setNewPin(e.target.value)}
            placeholder="PIN (4-6 digits)"
            maxLength={6}
            className="px-3 py-2 rounded text-sm outline-none w-32"
            style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: 'var(--paper)' }}
          />
          <button onClick={handleAdd}
            className="px-4 py-2 rounded text-sm font-semibold transition-colors"
            style={{ backgroundColor: 'var(--moss)', color: 'var(--paper)' }}>
            + Add Staff
          </button>
        </div>
      </div>

    </div>
  );
}
