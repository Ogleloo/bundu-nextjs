// ============================================================
// DASHBOARD HEADER — top bar inside the staff dashboard
// ============================================================
import Link from 'next/link';
import type { StaffMember } from '@/types';

interface DashboardHeaderProps {
  staff: StaffMember;
  onRefresh: () => void;
}

export default function DashboardHeader({ staff, onRefresh }: DashboardHeaderProps) {
  return (
    <div className="bg-chalk border-b-2 border-[#2d3a22] px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-xl text-paper">
          Bundu <span className="text-chalk-yellow italic">Foods</span>
        </h1>
        <span className="bg-burgundy text-paper text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded">
          {staff.role === 'owner' ? `Owner — ${staff.name}` : `Staff — ${staff.name}`}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs text-green-400 font-semibold before:content-[''] before:w-2 before:h-2 before:bg-green-400 before:rounded-full before:animate-pulse">
          Live
        </span>
        <button onClick={onRefresh} className="border border-[#2d3a22] text-kraft text-xs font-semibold uppercase tracking-wide px-3 py-2 rounded hover:bg-[#2d3a22] hover:text-paper transition-colors">
          ↻ Refresh
        </button>
        <Link href="/" className="border border-[#333] text-[#888] text-xs font-semibold uppercase tracking-wide px-3 py-2 rounded hover:text-paper hover:border-[#666] transition-colors">
          ← Site
        </Link>
      </div>
    </div>
  );
}
