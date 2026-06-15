// ============================================================
// NAVBAR — main site navigation
// Shows: logo, links, WhatsApp/Call buttons, Login or Profile dropdown
// Edit this file to: change nav links, add new nav items
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

  // Close dropdown when clicking outside
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
    <nav className="bg-chalk sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 border-b-2 border-kraft">
      <Link href="/" className="font-display text-xl text-paper">
        Bundu <span className="text-chalk-yellow italic">Foods</span>
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-6 text-paper text-sm font-medium">
        <li><Link href="/menu" className="hover:text-chalk-yellow transition-colors">Menu</Link></li>
        <li><Link href="/#catering" className="hover:text-chalk-yellow transition-colors">Catering</Link></li>
        <li><Link href="/#events" className="hover:text-chalk-yellow transition-colors">Events</Link></li>
        <li><Link href="/#visit" className="hover:text-chalk-yellow transition-colors">Visit</Link></li>
      </ul>

      <div className="flex items-center gap-2">
        <a
          href="https://wa.me/27737155505?text=Hi%20Bundu%2C%20I%27d%20like%20to%20place%20an%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 bg-moss text-paper text-xs font-semibold px-3 py-2 rounded-sm hover:bg-moss-deep transition-colors"
          style={{ backgroundColor: 'var(--moss)' }}
        >
          WhatsApp →
        </a>
        <a
          href="tel:+27640746461"
          className="hidden sm:inline-flex items-center gap-1 bg-moss text-paper text-xs font-semibold px-3 py-2 rounded-sm hover:bg-moss-deep transition-colors"
          style={{ backgroundColor: 'var(--moss)' }}
        >
          📞 Call
        </a>

        {/* Profile or Login */}
        {profile ? (
          <div className="relative" ref={wrapRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full font-display text-xs font-bold flex items-center justify-center border-2 border-kraft transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--burgundy)', color: 'var(--paper)' }}
            >
              {getInitials(profile.name)}
            </button>

            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-paper border border-kraft rounded shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-kraft bg-paper-dark">
                  <div className="font-display text-sm font-bold text-ink">{profile.name}</div>
                  <div className="text-xs text-ink-soft truncate">{profile.email}</div>
                </div>
                <Link href="/orders/history" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-paper-dark hover:text-burgundy transition-colors">
                  📦 My Orders
                </Link>
                <Link href="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-paper-dark hover:text-burgundy transition-colors">
                  👤 My Details
                </Link>
                <Link href="/profile?tab=password" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-paper-dark hover:text-burgundy transition-colors">
                  🔑 Change Password
                </Link>
                <div className="h-px bg-kraft" />
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  ↩ Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1 text-paper text-xs font-semibold px-3 py-2 rounded-sm transition-colors"
            style={{ backgroundColor: 'var(--moss)' }}
          >
            Login
          </Link>
        )}

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-paper text-2xl px-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile dropdown links */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-chalk border-b-2 border-kraft flex flex-col md:hidden">
          <Link href="/menu" onClick={() => setMobileOpen(false)} className="px-6 py-3 text-paper border-t border-white/10">Menu</Link>
          <Link href="/#catering" onClick={() => setMobileOpen(false)} className="px-6 py-3 text-paper border-t border-white/10">Catering</Link>
          <Link href="/#events" onClick={() => setMobileOpen(false)} className="px-6 py-3 text-paper border-t border-white/10">Events</Link>
          <Link href="/#visit" onClick={() => setMobileOpen(false)} className="px-6 py-3 text-paper border-t border-white/10">Visit</Link>
        </div>
      )}
    </nav>
  );
}
