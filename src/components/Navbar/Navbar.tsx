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
    <nav style={{
      backgroundColor: 'var(--warm-white)',
      borderBottom: '3px solid var(--fire-red)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}
        className="flex items-center justify-between h-16">

        {/* Brand */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 900,
            color: 'var(--fire-red)',
            letterSpacing: '-0.5px',
          }}>
            Bundu <span style={{ color: 'var(--tree-green)' }}>Foods</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '/menu', label: 'Menu' },
            { href: '/events', label: 'Events' },
            { href: '/#visit', label: 'Visit' },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--charcoal)',
              textDecoration: 'none',
              letterSpacing: '0.3px',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--fire-red)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--charcoal)')}
            >
              {link.label}
            </Link>
          ))}

          <Link href="/orders" style={{
            backgroundColor: 'var(--fire-red)',
            color: 'white',
            padding: '0.6rem 1.4rem',
            borderRadius: '6px',
            fontWeight: 700,
            fontSize: '0.875rem',
            textDecoration: 'none',
            letterSpacing: '0.5px',
            transition: 'background-color 0.2s, transform 0.1s',
            display: 'inline-block',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--fire-red-deep)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'var(--fire-red)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Order Now
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {profile ? (
            <div className="relative" ref={wrapRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  width: 40, height: 40,
                  borderRadius: '50%',
                  backgroundColor: 'var(--tree-green)',
                  color: 'white',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '2px solid var(--tree-green-deep)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {getInitials(profile.name)}
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  width: 200,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                  zIndex: 100,
                }}>
                  <div style={{
                    padding: '0.9rem 1rem',
                    borderBottom: '1px solid var(--border)',
                    backgroundColor: 'var(--warm-gray)',
                  }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--charcoal)' }}>
                      {profile.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--ash)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {profile.email}
                    </div>
                  </div>
                  {[
                    { href: '/orders', label: '🍳 Place an Order' },
                    { href: '/orders/history', label: '📦 My Orders' },
                    { href: '/profile', label: '👤 My Details' },
                    { href: '/profile?tab=password', label: '🔑 Change Password' },
                  ].map(item => (
                    <Link key={item.href} href={item.href}
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '0.7rem 1rem',
                        fontSize: '0.82rem',
                        color: 'var(--charcoal)',
                        textDecoration: 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--warm-gray)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div style={{ height: 1, backgroundColor: 'var(--border)' }} />
                  <button onClick={handleLogout} style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.7rem 1rem',
                    fontSize: '0.82rem',
                    color: 'var(--fire-red)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fff5f5')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    ↩ Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" style={{
              backgroundColor: 'transparent',
              color: 'var(--tree-green)',
              padding: '0.55rem 1.1rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
              border: '2px solid var(--tree-green)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--tree-green)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--tree-green)';
              }}
            >
              Login
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--charcoal)',
              padding: '0.25rem',
            }}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          borderTop: '1px solid var(--border)',
          backgroundColor: 'white',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}>
          {[
            { href: '/menu', label: 'Menu' },
            { href: '/events', label: 'Events' },
            { href: '/#visit', label: 'Visit' },
          ].map(link => (
            <Link key={link.href} href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: '0.75rem 0',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--charcoal)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--border)',
              }}>
              {link.label}
            </Link>
          ))}
          <Link href="/orders" onClick={() => setMobileOpen(false)} style={{
            marginTop: '0.75rem',
            backgroundColor: 'var(--fire-red)',
            color: 'white',
            padding: '0.9rem',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none',
            display: 'block',
          }}>
            🍳 Order Now
          </Link>
        </div>
      )}
    </nav>
  );
}
