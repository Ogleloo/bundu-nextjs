// ============================================================
// NAVBAR — main site navigation
// ============================================================
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getInitials, logOut } from '@/services/authService';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { profile, refresh } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  async function handleLogout() {
    setDropdownOpen(false);
    await logOut();
    await refresh();
    router.push('/');
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 border-b-2"
      style={{ backgroundColor: 'var(--chalk-bg)', borderColor: 'rgba(200,168,117,0.3)' }}>

      <Link href="/" className="font-display text-xl" style={{ color: 'var(--paper)' }}>
        Bundu <span style={{ color: 'var(--chalk-yellow)', fontStyle: 'italic' }}>Foods</span>
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: 'var(--paper)' }}>
        <li><Link href="/menu" className="hover:text-chalk-yellow transition-colors" style={{ color: 'var(--paper)' }}>Menu</Link></li>
        <li><Link href="/events" className="hover:text-chalk-yellow transition-colors" style={{ color: 'var(--paper)' }}>Events</Link></li>
        <li><Link href="/#visit" className="hover:text-chalk-yellow transition-colors" style={{ color: 'var(--paper)' }}>Visit</Link></li>
        <li>
          <Link href="/orders"
            className="px-4 py-2 rounded text-sm font-semibold uppercase tracking-wide transition-colors"
            style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}>
            Order Now
          </Link>
        </li>
      </ul>

      <div className="flex items-center gap-2">
        {/* Profile or Login */}
        {profile ? (
          <div className="relative" ref={wrapRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full font-display text-xs font-bold flex items-center justify-center border-2 transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)', borderColor: 'var(--kraft)' }}
            >
              {getInitials(profile.name)}
            </button>

            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded shadow-xl overflow-hidden z-50"
                style={{ backgroundColor: 'var(--paper)', border: '1px solid var(--kraft)' }}>
                <div className="px-4 py-3 border-b" style={{ backgroundColor: 'var(--paper-dark)', borderColor: 'var(--kraft)' }}>
                  <div className="font-display text-sm font-bold" style={{ color: 'var(--ink)' }}>{profile.name}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--ink-soft)' }}>{profile.email}</div>
                </div>
                <Link href="/orders" onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2.5 text-sm hover:text-burgundy transition-colors"
                  style={{ color: 'var(--ink)' }}>
                  🍳 Place an Order
                </Link>
                <Link href="/orders/history" onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2.5 text-sm hover:text-burgundy transition-colors"
                  style={{ color: 'var(--ink)' }}>
                  📦 My Orders
                </Link>
                <Link href="/profile" onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2.5 text-sm hover:text-burgundy transition-colors"
                  style={{ color: 'var(--ink)' }}>
                  👤 My Details
                </Link>
                <Link href="/profile?tab=password" onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2.5 text-sm hover:text-burgundy transition-colors"
                  style={{ color: 'var(--ink)' }}>
                  🔑 Change Password
                </Link>
                <div className="h-px" style={{ backgroundColor: 'var(--kraft)' }} />
                <button onClick={handleLogout}
                  className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  ↩ Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/auth/login"
            className="text-xs font-semibold px-3 py-2 rounded transition-colors"
            style={{ backgroundColor: 'var(--moss)', color: 'var(--paper)' }}>
            Login
          </Link>
        )}

        {/* Mobile toggle */}
        <button className="md:hidden text-2xl px-1" style={{ color: 'var(--paper)' }}
          onClick={() => setMobileOpen(!mobileOpen)}>
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 flex flex-col md:hidden border-b"
          style={{ backgroundColor: 'var(--chalk-bg)', borderColor: 'rgba(200,168,117,0.3)' }}>
          <Link href="/menu" onClick={() => setMobileOpen(false)}
            className="px-6 py-3 border-t" style={{ color: 'var(--paper)', borderColor: 'rgba(255,255,255,0.08)' }}>Menu</Link>
          <Link href="/events" onClick={() => setMobileOpen(false)}
            className="px-6 py-3 border-t" style={{ color: 'var(--paper)', borderColor: 'rgba(255,255,255,0.08)' }}>Events</Link>
          <Link href="/#visit" onClick={() => setMobileOpen(false)}
            className="px-6 py-3 border-t" style={{ color: 'var(--paper)', borderColor: 'rgba(255,255,255,0.08)' }}>Visit</Link>
          <Link href="/orders" onClick={() => setMobileOpen(false)}
            className="px-6 py-4 border-t font-semibold" style={{ color: 'var(--chalk-yellow)', borderColor: 'rgba(255,255,255,0.08)' }}>
            Order Now →
          </Link>
        </div>
      )}
    </nav>
  );
}
