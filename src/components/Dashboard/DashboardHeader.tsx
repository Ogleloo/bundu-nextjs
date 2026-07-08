import Link from 'next/link';
import type { StaffMember } from '@/types';

interface DashboardHeaderProps {
  staff: StaffMember;
  onRefresh: () => void;
  onLogout: () => void;
}

export default function DashboardHeader({ staff, onRefresh, onLogout }: DashboardHeaderProps) {
  const btnStyle = {
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.6)',
    padding: '0.45rem 0.9rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    transition: 'all 0.2s',
  };

  return (
    <div style={{
      backgroundColor: '#111',
      borderBottom: '2px solid var(--fire-red)',
      padding: '0.9rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900 }}>
          <span style={{ color: 'var(--fire-red)' }}>Bundu </span>
          <span style={{ color: 'var(--sun-yellow)' }}>Foods</span>
        </span>
        <span style={{
          backgroundColor: 'var(--fire-red)',
          color: 'white',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          padding: '0.2rem 0.6rem',
          borderRadius: '4px',
        }}>
          {staff.role === 'owner' ? `Owner` : `Staff`} — {staff.name}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Live indicator */}
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#4ade80', fontWeight: 600 }}>
          <span style={{ width: 7, height: 7, backgroundColor: '#4ade80', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          Live
        </span>
        <button onClick={onRefresh} style={btnStyle}>↻ Refresh</button>
        <Link href="/" style={{ ...btnStyle, textDecoration: 'none', display: 'inline-block' }}>← Site</Link>
        <button onClick={onLogout} style={{ ...btnStyle, borderColor: 'rgba(212,43,43,0.4)', color: '#f87171' }}>
          Logout
        </button>
      </div>
    </div>
  );
}
