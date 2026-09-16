'use client';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  // Order statuses
  PENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  COMPLETED: 'bg-emerald-500/15 text-primary border-emerald-500/30',
  CANCELLED: 'bg-red-500/15 text-red-400 border-red-500/30',
  REFUNDED: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  // Session statuses
  SCHEDULED: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  IN_PROGRESS: 'bg-emerald-500/15 text-primary border-emerald-500/30',
  // Course statuses
  DRAFT: 'bg-slate-500/15 text-foreground/60 border-slate-500/30',
  PUBLISHED: 'bg-emerald-500/15 text-primary border-emerald-500/30',
  ARCHIVED: 'bg-slate-500/15 text-foreground/60 border-slate-500/30',
  // Doubt
  OPEN: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  ANSWERED: 'bg-emerald-500/15 text-primary border-emerald-500/30',
  // Transaction
  SUCCESS: 'bg-emerald-500/15 text-primary border-emerald-500/30',
  FAILED: 'bg-red-500/15 text-red-400 border-red-500/30',
  // Roles
  LEARNER: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  INSTRUCTOR: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  ADMIN: 'bg-primary/15 text-primary/80 border-rose-500/30',
  // Coupons
  ACTIVE: 'bg-emerald-500/15 text-primary border-emerald-500/30',
  EXPIRED: 'bg-red-500/15 text-red-400 border-red-500/30',
  EXHAUSTED: 'bg-slate-500/15 text-foreground/60 border-slate-500/30',
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const colors = statusColors[status] || 'bg-slate-500/15 text-foreground/60 border-slate-500/30';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors} ${className}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
