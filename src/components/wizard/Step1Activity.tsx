import { useAppStore } from '@/stores/useAppStore';
import { Input, Textarea } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { validateStep1 } from '@/utils/validation';
import { CalendarDays, MapPin, User, FileText, Sparkles } from 'lucide-react';

export function Step1Activity() {
  const { activityInfo, setActivityInfo, nextStep, validations } = useAppStore();
  const validation = validations.find((v) => v.step === 1);

  const fieldError = (field: string) => {
    const err = validation?.errors.find((e) => e.field === field);
    return err?.message;
  };
  const fieldWarning = (field: string) => {
    const w = validation?.warnings.find((e) => e.field === field);
    return w?.message;
  };

  const requiredCount = [activityInfo.name, activityInfo.date, activityInfo.location, activityInfo.manager].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-8 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-8 shadow-sm">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg shadow-slate-800/20">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800">填写活动基础信息</h2>
            <p className="mt-1 text-sm text-slate-500">
              请准确填写本次体测活动的基本信息，这些信息将出现在最终核对报告中
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            name="name"
            label="活动名称"
            placeholder="例如：2026年春季大学生体质健康测试"
            value={activityInfo.name}
            onChange={(e) => setActivityInfo({ name: e.target.value })}
            required
            maxLength={50}
            leftIcon={<Sparkles className="h-4 w-4" />}
            error={fieldError('name')}
            hint={activityInfo.name ? `${activityInfo.name.length}/50 字` : undefined}
          />

          <Input
            name="date"
            type="date"
            label="体测日期"
            value={activityInfo.date}
            onChange={(e) => setActivityInfo({ date: e.target.value })}
            required
            leftIcon={<CalendarDays className="h-4 w-4" />}
            error={fieldError('date')}
          />

          <Input
            name="location"
            label="举办地点"
            placeholder="例如：学校体育馆 + 田径场"
            value={activityInfo.location}
            onChange={(e) => setActivityInfo({ location: e.target.value })}
            required
            maxLength={100}
            leftIcon={<MapPin className="h-4 w-4" />}
            error={fieldError('location')}
            hint={activityInfo.location ? `${activityInfo.location.length}/100 字` : undefined}
          />

          <Input
            name="manager"
            label="总负责人"
            placeholder="请输入负责人姓名"
            value={activityInfo.manager}
            onChange={(e) => setActivityInfo({ manager: e.target.value })}
            required
            maxLength={20}
            leftIcon={<User className="h-4 w-4" />}
            error={fieldError('manager')}
            hint={activityInfo.manager ? `${activityInfo.manager.length}/20 字` : undefined}
          />
        </div>

        <div className="mt-6">
          <Textarea
            name="remark"
            label="备注说明（选填）"
            placeholder="可填写活动特殊要求、注意事项等..."
            value={activityInfo.remark}
            onChange={(e) => setActivityInfo({ remark: e.target.value })}
            rows={4}
            maxLength={500}
            error={fieldError('remark')}
            hint={fieldWarning('remark') || (activityInfo.remark ? `${activityInfo.remark.length}/500 字` : '如有特殊安排可在此说明')}
          />
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
              {requiredCount}
            </div>
            <span>必填项已完成 / 共 4 项</span>
          </div>
          <Button
            size="lg"
            onClick={nextStep}
            disabled={!!validation?.hasError}
          >
            下一步：选择体测项目
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
