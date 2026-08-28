// ============================================================
// ORDER PAGE — /orders
// Cart review + checkout. No AuthGuard: guests can order too
// (submitted with user_id null). Signed-in customers get their
// name / WhatsApp prefilled from the profile.
// ============================================================
'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { OrderForm, DirectContactButtons } from '@/components/Orders';

export default function OrdersPage() {
  const { profile, loading } = useAuth();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper">
        {/* Hero strip */}
        <div className="bg-burgundy px-4 py-12 text-center border-b-4 border-double border-kraft">
          <h1 className="font-display text-3xl md:text-4xl text-paper">Place Your Order</h1>
          <p className="font-script text-xl text-chalk-yellow mt-1">fresh from the kitchen to you</p>
          <p className="text-paper/70 text-sm mt-2 max-w-sm mx-auto">
            Check your order and we&apos;ll get it going.
          </p>
        </div>

        <div className="px-4 py-8">
          {loading ? (
            <div className="max-w-xl mx-auto py-16 text-center">
              <p className="text-sm" style={{ color: 'var(--ash)' }}>Loading…</p>
            </div>
          ) : (
            <OrderForm profile={profile} />
          )}

          {/* Direct contact sits below the cart — someone with items ready
              to submit shouldn't be nudged to WhatsApp first */}
          <div className="mt-10">
            <DirectContactButtons />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
