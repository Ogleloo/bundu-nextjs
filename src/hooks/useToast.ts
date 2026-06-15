// ============================================================
// useToast — simple toast notification hook
// Usage: const { toast, showToast } = useToast();
//        showToast('✓ Saved!');
//        {toast && <div className="toast show">{toast}</div>}
// ============================================================
'use client';

import { useState, useCallback, useRef } from 'react';

export function useToast(duration = 2800) {
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), duration);
  }, [duration]);

  return { toast, showToast };
}
