// ============================================================
// DASHBOARD PAGE — /dashboard (staff PIN login required)
// Flow: StaffLogin -> OrderBoard (+ StaffManagement if owner)
// No Navbar/Footer — this is a separate internal tool
// ============================================================
'use client';

import { useState, useCallback } from 'react';
import { StaffLogin, OrderBoard, StaffManagement, DashboardHeader } from '@/components/Dashboard';
import type { StaffMember } from '@/types';

export default function DashboardPage() {
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  if (!staff) {
    return <StaffLogin onLogin={setStaff} />;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <DashboardHeader staff={staff} onRefresh={handleRefresh} />
      <OrderBoard key={refreshKey} staff={staff} />
      {staff.role === 'owner' && <StaffManagement />}
    </div>
  );
}
