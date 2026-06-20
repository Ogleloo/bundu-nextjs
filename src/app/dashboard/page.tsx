// ============================================================
// DASHBOARD PAGE — /dashboard
// Completely independent from customer auth.
// Staff log in with PIN only — no Supabase Auth session needed.
// ============================================================
'use client';

import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { StaffLogin, OrderBoard, StaffManagement, DashboardHeader } from '@/components/Dashboard';
import type { StaffMember } from '@/types';

export default function DashboardPage() {
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Sign out any customer session when dashboard loads
  // Staff access is PIN-only — completely independent
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.signOut();
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  if (!staff) {
    return <StaffLogin onLogin={setStaff} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <DashboardHeader staff={staff} onRefresh={handleRefresh} />
      <OrderBoard key={refreshKey} staff={staff} />
      {staff.role === 'owner' && <StaffManagement />}
    </div>
  );
}
