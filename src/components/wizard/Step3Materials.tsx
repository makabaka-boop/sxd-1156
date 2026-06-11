import { useAppStore } from '@/stores/useAppStore';
import { FilterBar } from '@/components/materials/FilterBar';
import { MaterialTable } from '@/components/materials/MaterialTable';
import { BatchActionBar } from '@/components/materials/BatchActionBar';
import { Button } from '@/components/common/Button';
import { ClipboardList, Package, CheckCircle, AlertTriangle, Clock, FileX2 } from 'lucide-react';
import { validateStep3 } from '@/utils/validation';

export function Step3Materials() {
  const {
    materialRecords,
    nextStep,
    prevStep,
    validations,
    role,
  } = useAppStore();
  const validation = validations.find((v) => v.step === 3);

  const totalCount = materialRecords.length;
  const arrivedCount = materialRecords.filter((r) => r.status === 'arrived').length;
  const problemCount = materialRecords.filter(
    (r) => r.status === 'need_supply' || r.status === 'suspended' || r.status === 'need_review',
  ).length;
  const pendingCount = materialRecords.filter((r) => r.status === 'pending').length;
  const completeRate = totalCount > 0 ? Math.round((arrivedCount / totalCount) * 100) : 0;

  const stats = [
    { label: '材料总项数', value: totalCount, icon: Package, color: 'from-slate-700 to-slate-900', textColor: 'text-slate-100' },
    { label: '已到位', value: arrivedCount, icon: CheckCircle, color: 'from-emerald-500 to-emerald-700', textColor: 'text-emerald-50' },
    { label: '待处理问题', value: problemCount, icon: AlertTriangle, color: 'from-amber-500 to-amber-700', textColor: 'text-amber-50' },
    { label: '待核对', value: pendingCount, icon: Clock, color: 'from-sky-500 to-sky-700', textColor: 'text-sky-50' },
  ];

  const readonly = role === 'reviewer';

  return (
    <div className="mx-auto max-w-[1400px] animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-6 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-sky-50/30 p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-sky-800 shadow-lg shadow-sky-800/20">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">逐项核对材料清单</h2>
              <p className="mt-1 text-sm text-slate-500">
                请核对各项材料的到位数量，填写负责小组与存放位置；如有损坏或短缺请详细说明
                {readonly && <span className="ml-2 text-amber-600 font-medium">（复核者模式：仅查看）</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-500">核对完成进度</div>
              <div className="text-2xl font-bold text-slate-800">{completeRate}%</div>
            </div>
            <div className="relative h-14 w-14">
              <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="url(#progressGrad)"
                  strokeWidth="3"
                  strokeDasharray={`${completeRate}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.color} p-4 text-white shadow-sm`}
              >
                <div className="absolute -right-2 -top-2 opacity-10">
                  <Icon className="h-20 w-20" />
                </div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-medium ${stat.textColor} opacity-80`}>{stat.label}</p>
                    <p className="mt-1 text-3xl font-extrabold tracking-tight">{stat.value}</p>
                  </div>
                  <div className={`rounded-lg bg-white/15 p-2 backdrop-blur`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {(validation?.hasError || validation?.hasWarning) && (
          <div className="mt-5 space-y-2">
            {validation.errors.slice(0, 3).map((e, i) => (
              <div key={`err-${i}`} className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600">
                <FileX2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{e.message}</span>
              </div>
            ))}
            {validation.warnings.slice(0, 3).map((w, i) => (
              <div key={`warn-${i}`} className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-600">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{w.message}</span>
              </div>
            ))}
            {(validation.errors.length > 3 || validation.warnings.length > 3) && (
              <p className="text-xs text-slate-500 pl-2">
                ...另有 {Math.max(0, validation.errors.length - 3) + Math.max(0, validation.warnings.length - 3)} 条问题请在表格中逐项查看并修正
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mb-4">
        <FilterBar />
      </div>

      <div>
        <MaterialTable />
      </div>

      <BatchActionBar />

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
        <Button variant="secondary" size="lg" onClick={prevStep}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          上一步：返回选项目
        </Button>
        <Button
          size="lg"
          onClick={nextStep}
          disabled={materialRecords.length === 0}
        >
          下一步：复核确认
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
