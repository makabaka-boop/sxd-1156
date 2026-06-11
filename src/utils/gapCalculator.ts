import type { GapLevel } from '@/types';

export function calculateGapLevel(expected: number, actual: number): GapLevel {
  if (actual >= expected) return 'none';
  const gap = expected - actual;
  const ratio = gap / expected;
  if (ratio <= 0.1) return 'low';
  if (ratio <= 0.3) return 'medium';
  return 'high';
}

export const gapLevelLabels: Record<GapLevel, string> = {
  none: '无缺口',
  low: '少量缺口',
  medium: '中等缺口',
  high: '严重缺口',
};

export const gapLevelColors: Record<GapLevel, string> = {
  none: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  low: 'bg-amber-100 text-amber-700 border-amber-200',
  medium: 'bg-orange-100 text-orange-700 border-orange-200',
  high: 'bg-red-100 text-red-700 border-red-200',
};
