import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { MaterialStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const statusLabels: Record<MaterialStatus, string> = {
  pending: '待核对',
  arrived: '已到位',
  need_supply: '需补充',
  need_review: '需复核',
  suspended: '暂停使用',
};

export const statusColors: Record<MaterialStatus, string> = {
  pending: 'bg-slate-100 text-slate-600 border-slate-200',
  arrived: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  need_supply: 'bg-amber-100 text-amber-700 border-amber-200',
  need_review: 'bg-sky-100 text-sky-700 border-sky-200',
  suspended: 'bg-red-100 text-red-700 border-red-200',
};

export const statusDotColors: Record<MaterialStatus, string> = {
  pending: 'bg-slate-400',
  arrived: 'bg-emerald-500',
  need_supply: 'bg-amber-500',
  need_review: 'bg-sky-500',
  suspended: 'bg-red-500',
};

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
