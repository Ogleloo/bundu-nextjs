// ============================================================
// DASHBOARD PAGE — /dashboard
// Session lives in an httpOnly signed cookie set by
// POST /api/staff/login, verified here via GET /api/staff/me.
// Not readable or forgeable from the browser — replaces the old
// sessionStorage check, which anyone could set by hand in devtools.
// If there's no valid session, redirect to /staff-login.
// ============================================================
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OrderBoard, StaffManagement, DashboardHeader } from '@/components/Dashboard';
import { getCurrentStaff, staffLogout } from '@/services/staffService';
import type { StaffSummary } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffSummary | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const current = await getCurrentStaff();
      if (!current) {
        router.replace('/staff-login');
        return;
      }
      setStaff(current);
      setChecking(false);
    })();
  }, [router]);

  const handleRefresh = useCallback(() => setRefreshKey(k => k + 1), []);

  async function handleLogout() {
    await staffLogout();
    router.replace('/staff-login');
  }

  if (checking || !staff) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f0f' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}>Verifying access...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f' }}>
      <DashboardHeader staff={staff} onRefresh={handleRefresh} onLogout={handleLogout} />
      <OrderBoard key={refreshKey} staff={staff} />
      {staff.role === 'owner' && <StaffManagement />}
    </div>
  );
}
