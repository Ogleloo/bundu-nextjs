// ============================================================
// AUTH CARD — shared card wrapper with tabs for login/signup
// Used in src/app/auth/login/page.tsx and src/app/auth/signup/page.tsx
// ============================================================
import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthCardProps {
  activeTab: 'login' | 'signup';
  children: ReactNode;
}

export default function AuthCard({ activeTab, children }: AuthCardProps) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-chalk px-4 py-8">
      <div className="bg-paper border border-kraft rounded-md max-w-md w-full overflow-hidden shadow-2xl">
        <div className="bg-burgundy px-8 py-8 text-center border-b-[3px] border-double border-paper">
          <h2 className="font-display text-2xl text-paper">Bundu Foods</h2>
          <p className="font-script text-xl text-chalk-yellow mt-1">your table is waiting</p>
        </div>

        <div className="grid grid-cols-2 border-b border-kraft">
          <Link
            href="/auth/login"
            className={`text-center py-4 text-sm font-semibold uppercase tracking-wide transition-colors ${
              activeTab === 'login' ? 'bg-paper text-burgundy border-b-2 border-burgundy' : 'bg-paper-dark text-ink-soft'
            }`}
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className={`text-center py-4 text-sm font-semibold uppercase tracking-wide transition-colors ${
              activeTab === 'signup' ? 'bg-paper text-burgundy border-b-2 border-burgundy' : 'bg-paper-dark text-ink-soft'
            }`}
          >
            Sign Up
          </Link>
        </div>

        <div className="p-8">
          {children}

          <div className="text-center mt-4">
            <Link href="/" className="text-xs text-ink-soft hover:text-burgundy">
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
