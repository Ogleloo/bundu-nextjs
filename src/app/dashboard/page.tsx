// ============================================================
// DASHBOARD PAGE — /dashboard
// Reads staff session from sessionStorage set by /staff-login
// If no session found, redirects to /staff-login
// ============================================================
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OrderBoard, StaffManagement, DashboardHeader } from '@/components/Dashboard';
import type { StaffMember } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check for staff session set by /staff-login
    const stored = sessionStorage.getItem('bundu-staff');
    if (!stored) {
      router.replace('/staff-login');
      return;
    }
    try {
      setStaff(JSON.parse(stored));
    } catch {
      router.replace('/staff-login');
      return;
    }
    setChecking(false);
  }, [router]);

  const handleRefresh = useCallback(() => setRefreshKey(k => k + 1), []);

  function handleLogout() {
    sessionStorage.removeItem('bundu-staff');
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
