// ============================================================
// ORDER PAGE — /orders (requires login)
// Shows direct contact buttons + order form
// ============================================================
'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/UI/AuthGuard';
import { OrderForm, DirectContactButtons } from '@/components/Orders';

export default function OrdersPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper">
        {/* Hero strip */}
        <div className="bg-burgundy px-4 py-12 text-center border-b-4 border-double border-kraft">
          <h1 className="font-display text-3xl md:text-4xl text-paper">Place Your Order</h1>
          <p className="font-script text-xl text-chalk-yellow mt-1">fresh from the kitchen to you</p>
          <p className="text-paper/70 text-sm mt-2 max-w-sm mx-auto">
            Fill in the form below or reach us directly on WhatsApp or phone.
          </p>
        </div>

        <div className="px-4 py-8">
          <DirectContactButtons />
          <AuthGuard>
            {(profile) => <OrderForm profile={profile} />}
          </AuthGuard>
        </div>
      </main>
      <Footer />
    </>
  );
}
