// ============================================================
// LOGO LOADER — the Bundu mark with a fire-coloured ring
// sweeping around it. Pure CSS (see .logo-loader in
// src/styles/globals.css), no animation library. The ring slows
// right down under prefers-reduced-motion.
// Use in place of plain "loading..." text.
// ============================================================
import type { CSSProperties } from 'react';

interface LogoLoaderProps {
  /** Diameter in px. Default 72. */
  size?: number;
  /** Announced to screen readers while the ring spins. */
  label?: string;
}

export default function LogoLoader({ size = 72, label = 'Loading' }: LogoLoaderProps) {
  const style: CSSProperties = { width: size, height: size };
  return (
    <span className="logo-loader" style={style} role="status" aria-label={label}>
      <span className="logo-loader__ring" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo-loader__mark" src="/logo/loader-mark.png" alt="" aria-hidden="true" />
    </span>
  );
}
