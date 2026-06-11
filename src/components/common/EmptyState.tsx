import type { ReactNode } from 'react';
import { cn } from '@/utils/helpers';
import { ClipboardList, AlertTriangle, Search } from 'lucide-react';

interface EmptyStateProps {
  type?: 'default' | 'noData' | 'noSearch' | 'warning';
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

const iconMap = {
  default: <ClipboardList className="w-12 h-12" />,
  noData: <ClipboardList className="w-12 h-12" />,
  noSearch: <Search className="w-12 h-12" />,
  warning: <AlertTriangle className="w-12 h-12" />,
};

const colorMap = {
  default: 'text-slate-400',
  noData: 'text-slate-400',
  noSearch: 'text-slate-400',
  warning: 'text-amber-500',
};

export function EmptyState({
  type = 'default',
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className,
      )}
    >
      <div className={cn('mb-4 opacity-80', colorMap[type])}>
        {icon || iconMap[type]}
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
