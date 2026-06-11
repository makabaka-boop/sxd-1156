import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Tag';
import { EmptyState } from '@/components/common/EmptyState';
import { validateStep2 } from '@/utils/validation';
import {
  Ruler, Wind, Timer, Footprints, Dumbbell,
  StretchHorizontal, PersonStanding, ChevronDown, ChevronUp,
  ListChecks, Package, Check, LayoutGrid, X,
} from 'lucide-react';
import { cn } from '@/utils/helpers';

const iconMap: Record<string, typeof Ruler> = {
  Ruler, Wind, Timer, Footprints, Dumbbell, StretchHorizontal, PersonStanding,
};

export function Step2Projects() {
  const {
    projects,
    selectedProjectIds,
    toggleProject,
    selectAllProjects,
    clearAllProjects,
    materialRecords,
    nextStep,
    prevStep,
    validations,
  } = useAppStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const validation = validations.find((v) => v.step === 2);

  const totalMaterials = selectedProjectIds.reduce((sum, pid) => {
    const p = projects.find((proj) => proj.id === pid);
    return sum + (p?.materials.length || 0);
  }, 0);

  const totalQty = materialRecords.reduce((sum, r) => sum + r.expectedQuantity, 0);

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-6 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-lg shadow-emerald-800/20">
              <ListChecks className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">选择本次体测项目</h2>
              <p className="mt-1 text-sm text-slate-500">
                勾选涉及的体测项目，系统将自动加载对应项目所需的材料清单
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={selectAllProjects}>
              <LayoutGrid className="h-4 w-4" />
              全选
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAllProjects}>
              <X className="h-4 w-4" />
              清空
            </Button>
          </div>
        </div>

        {validation?.hasError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {validation.errors[0]?.message}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5">
            <Check className={cn('h-4 w-4', selectedProjectIds.length > 0 ? 'text-emerald-600' : 'text-slate-400')} />
            <span className="text-slate-600">
              已选项目：<span className="font-bold text-slate-800">{selectedProjectIds.length}</span> / {projects.length}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5">
            <Package className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">
              材料种类：<span className="font-bold text-slate-800">{totalMaterials}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5">
            <span className="text-slate-600">
              应到总件数：<span className="font-bold text-slate-800">{totalQty}</span>
            </span>
          </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          type="noData"
          title="暂未配置体测项目"
          description="请切换到管理者角色，在项目配置中添加体测项目和材料清单。"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const Icon = iconMap[project.icon] || Ruler;
            const selected = selectedProjectIds.includes(project.id);
            const expanded = expandedId === project.id;
            return (
              <div
                key={project.id}
                className={cn(
                  'group relative rounded-2xl border-2 bg-white transition-all duration-300 overflow-hidden',
                  selected
                    ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.01]'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-lg',
                )}
              >
                {selected && (
                  <div className="absolute top-0 right-0">
                    <div className="relative">
                      <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rotate-45 translate-x-8 -translate-y-8" />
                      <Check className="absolute top-1.5 right-2.5 h-5 w-5 text-white stroke-[3]" />
                    </div>
                  </div>
                )}

                <div
                  className="cursor-pointer p-5"
                  onClick={() => toggleProject(project.id)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300',
                        selected
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200',
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1 pr-6">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-lg font-bold text-slate-800">{project.name}</h3>
                        <Badge color={selected ? 'emerald' : 'slate'}>
                          {project.materials.length}
                        </Badge>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {project.description || '无描述'}
                      </p>
                      <div className="mt-2 text-xs text-slate-400">
                        {project.materials.reduce((s, m) => s + m.defaultQuantity, 0)} 件器材
                      </div>
                    </div>
                  </div>
                </div>

                {project.materials.length > 0 && (
                  <div className="border-t border-slate-100">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-2 px-5 py-2.5 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(expanded ? null : project.id);
                      }}
                    >
                      <span>查看材料清单</span>
                      {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {expanded && (
                      <div className="max-h-48 overflow-y-auto border-t border-slate-50 bg-slate-50/50 px-5 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <ul className="space-y-2">
                          {project.materials.map((m) => (
                            <li
                              key={m.id}
                              className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm shadow-sm"
                            >
                              <span className="truncate text-slate-700">{m.name}</span>
                              <span className="shrink-0 text-xs font-bold text-slate-500">
                                × {m.defaultQuantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
        <Button variant="secondary" size="lg" onClick={prevStep}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          上一步
        </Button>
        <Button
          size="lg"
          onClick={nextStep}
          disabled={!!validation?.hasError || selectedProjectIds.length === 0}
        >
          下一步：核对材料 ({totalMaterials}项)
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
