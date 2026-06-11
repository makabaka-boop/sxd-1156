import { cn, statusLabels, statusColors, statusDotColors } from '@/utils/helpers';
import { gapLevelLabels, gapLevelColors } from '@/utils/gapCalculator';
import type { MaterialStatus, GapLevel } from '@/types';

interface StatusTagProps {
  status: MaterialStatus;
  showDot?: boolean;
  className?: string;
}

export function StatusTag({ status, showDot = true, className }: StatusTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        statusColors[status],
        className,
      )}
    >
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full', statusDotColors[status])} />}
      {statusLabels[status]}
    </span>
  );
}

interface GapTagProps {
  level: GapLevel;
  className?: string;
}

export function GapTag({ level, className }: GapTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
        gapLevelColors[level],
        className,
      )}
    >
      {gapLevelLabels[level]}
    </span>
  );
}

interface RoleTagProps {
  role: 'manager' | 'executor' | 'reviewer';
  className?: string;
}

const roleStyles = {
  manager: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  executor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  reviewer: 'bg-amber-100 text-amber-700 border-amber-200',
} as const;

const roleLabels = {
  manager: '管理者',
  executor: '执行者',
  reviewer: '复核者',
} as const;

export function RoleTag({ role, className }: RoleTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
        roleStyles[role],
        className,
      )}
    >
      {roleLabels[role]}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  color?: 'slate' | 'red' | 'amber' | 'emerald' | 'sky' | 'indigo';
  className?: string;
}

const badgeColors = {
  slate: 'bg-slate-500 text-white',
  red: 'bg-red-500 text-white',
  amber: 'bg-amber-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  sky: 'bg-sky-500 text-white',
  indigo: 'bg-indigo-500 text-white',
} as const;

export function Badge({ children, color = 'slate', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold',
        badgeColors[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
