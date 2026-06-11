import { useAppStore } from '@/stores/useAppStore';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { statusLabels, followUpStatusLabels } from '@/utils/helpers';
import { gapLevelLabels } from '@/utils/gapCalculator';
import { cn } from '@/utils/helpers';
import { Search, Filter, X, RotateCcw, ChevronDown } from 'lucide-react';
import type { MaterialStatus, GapLevel, FollowUpStatus } from '@/types';
import { useState, useRef, useEffect } from 'react';

interface ChipFilterProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  selected: T[];
  onChange: (values: T[]) => void;
}

function ChipFilter<T extends string>({ label, options, selected, onChange }: ChipFilterProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (val: T) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all',
          selected.length > 0
            ? 'border-slate-800 bg-slate-800 text-white'
            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
        )}
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold">
            {selected.length}
          </span>
        )}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150">
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {options.map((opt) => {
              const active = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle(opt.value)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                    active ? 'bg-slate-100 text-slate-800 font-medium' : 'text-slate-600 hover:bg-slate-50',
                  )}
                >
                  <span>{opt.label}</span>
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded border-2',
                      active ? 'border-slate-800 bg-slate-800' : 'border-slate-300',
                    )}
                  >
                    {active && (
                      <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function FilterBar() {
  const {
    projects,
    presetGroups,
    materialRecords,
    filters,
    setFilters,
    resetFilters,
  } = useAppStore();

  const usedProjectIds = Array.from(new Set(materialRecords.map((r) => r.projectId)));
  const projectOptions = projects
    .filter((p) => usedProjectIds.includes(p.id))
    .map((p) => ({ value: p.id, label: p.name }));

  const usedGroups = Array.from(new Set(materialRecords.map((r) => r.responsibleGroup).filter(Boolean)));
  const groupOptions = [...usedGroups, ...presetGroups.filter((g) => !usedGroups.includes(g))].map((g) => ({
    value: g,
    label: g,
  }));

  const statusOptions = (Object.keys(statusLabels) as MaterialStatus[]).map((s) => ({
    value: s,
    label: statusLabels[s],
  }));

  const gapOptions = (Object.keys(gapLevelLabels) as GapLevel[]).map((g) => ({
    value: g,
    label: gapLevelLabels[g],
  }));

  const followUpOptions = (Object.keys(followUpStatusLabels) as FollowUpStatus[]).map((f) => ({
    value: f,
    label: followUpStatusLabels[f],
  }));

  const activeCount =
    filters.projectIds.length +
    filters.groups.length +
    filters.statuses.length +
    filters.gapLevels.length +
    filters.followUpStatuses.length +
    (filters.keyword ? 1 : 0);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Filter className="h-4 w-4" />
          <span>筛选条件</span>
        </div>

        <div className="min-w-[240px] flex-1 max-w-sm">
          <Input
            placeholder="搜索材料名称、存放点、负责人..."
            value={filters.keyword}
            onChange={(e) => setFilters({ keyword: e.target.value })}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <ChipFilter
          label="所属项目"
          options={projectOptions}
          selected={filters.projectIds}
          onChange={(v) => setFilters({ projectIds: v })}
        />

        <ChipFilter
          label="负责小组"
          options={groupOptions}
          selected={filters.groups}
          onChange={(v) => setFilters({ groups: v })}
        />

        <ChipFilter
          label="处理状态"
          options={statusOptions}
          selected={filters.statuses}
          onChange={(v) => setFilters({ statuses: v })}
        />

        <ChipFilter
          label="缺口等级"
          options={gapOptions}
          selected={filters.gapLevels}
          onChange={(v) => setFilters({ gapLevels: v })}
        />

        <ChipFilter
          label="跟进状态"
          options={followUpOptions}
          selected={filters.followUpStatuses}
          onChange={(v) => setFilters({ followUpStatuses: v })}
        />

        <div className="ml-auto flex items-center gap-2">
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <RotateCcw className="h-4 w-4" />
              清除全部 ({activeCount})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
