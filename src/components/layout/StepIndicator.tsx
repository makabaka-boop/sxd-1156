import { useAppStore } from '@/stores/useAppStore';
import { Check, AlertTriangle, FileText, ListChecks, ClipboardList, ShieldCheck } from 'lucide-react';
import { cn } from '@/utils/helpers';

const steps = [
  { step: 1, title: '活动信息', subtitle: '填写基础信息', icon: FileText },
  { step: 2, title: '项目选择', subtitle: '勾选体测项目', icon: ListChecks },
  { step: 3, title: '材料核对', subtitle: '逐项核对到位情况', icon: ClipboardList },
  { step: 4, title: '复核确认', subtitle: '最终检查与提交', icon: ShieldCheck },
];

export function StepIndicator() {
  const { currentStep, validations, setCurrentStep } = useAppStore();

  const getStepState = (step: number) => {
    const validation = validations.find((v) => v.step === step);
    if (step < currentStep) {
      if (validation?.hasError) return 'error';
      if (validation?.hasWarning) return 'warning';
      return 'done';
    }
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  const getCountBadge = (step: number) => {
    const v = validations.find((val) => val.step === step);
    if (!v) return null;
    if (v.hasError) return { count: v.errors.length, type: 'error' as const };
    if (v.hasWarning) return { count: v.warnings.length, type: 'warning' as const };
    return null;
  };

  return (
    <div className="relative py-8 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="relative">
          <div className="absolute top-[30px] left-0 right-0 h-0.5 bg-slate-200" />
          <div
            className="absolute top-[30px] left-0 h-0.5 bg-gradient-to-r from-slate-700 to-slate-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />

          <ol className="relative grid grid-cols-4 gap-4">
            {steps.map((s) => {
              const state = getStepState(s.step);
              const Icon = s.icon;
              const badge = getCountBadge(s.step);
              const clickable = s.step <= currentStep;

              return (
                <li key={s.step} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => clickable && setCurrentStep(s.step)}
                    className={cn(
                      'relative z-10 flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 transition-all duration-300',
                      clickable && 'cursor-pointer',
                      !clickable && 'cursor-not-allowed',
                      state === 'done' &&
                        'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
                      state === 'current' &&
                        'border-slate-800 bg-white text-slate-800 shadow-xl shadow-slate-800/20 scale-110',
                      state === 'error' &&
                        'border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/30',
                      state === 'warning' &&
                        'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/30',
                      state === 'upcoming' &&
                        'border-slate-200 bg-white text-slate-300',
                    )}
                  >
                    {state === 'done' ? (
                      <Check className="h-7 w-7 stroke-[3]" />
                    ) : state === 'error' || state === 'warning' ? (
                      <AlertTriangle className="h-6 w-6" />
                    ) : (
                      <Icon className={cn('h-6 w-6', state === 'upcoming' ? 'opacity-40' : '')} />
                    )}

                    {badge && (
                      <span
                        className={cn(
                          'absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] font-bold',
                          badge.type === 'error'
                            ? 'bg-red-600 text-white border-2 border-white'
                            : 'bg-amber-500 text-white border-2 border-white',
                        )}
                      >
                        {badge.count}
                      </span>
                    )}
                  </button>

                  <div className="mt-3 text-center">
                    <p
                      className={cn(
                        'text-sm font-bold transition-colors',
                        state === 'current' && 'text-slate-800',
                        state === 'done' && 'text-emerald-700',
                        state === 'error' && 'text-red-600',
                        state === 'warning' && 'text-amber-600',
                        state === 'upcoming' && 'text-slate-400',
                      )}
                    >
                      第{s.step}步 · {s.title}
                    </p>
                    <p
                      className={cn(
                        'mt-0.5 text-xs',
                        state === 'upcoming' ? 'text-slate-300' : 'text-slate-500',
                      )}
                    >
                      {s.subtitle}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
