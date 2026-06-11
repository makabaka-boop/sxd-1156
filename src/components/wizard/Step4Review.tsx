import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/common/Button';
import { Input, Textarea, Select } from '@/components/common/Input';
import { StatusTag, GapTag } from '@/components/common/Tag';
import { Modal } from '@/components/common/Modal';
import {
  ShieldCheck, Package, CheckCircle2, AlertOctagon, AlertTriangle, Pause,
  ChevronDown, ChevronRight, FileText, CalendarDays, MapPin, User,
  Printer, PartyPopper,
} from 'lucide-react';
import { cn, formatDate } from '@/utils/helpers';
import { gapLevelLabels } from '@/utils/gapCalculator';
import type { GapLevel, MaterialStatus } from '@/types';

export function Step4Review() {
  const navigate = useNavigate();
  const {
    activityInfo,
    selectedProjectIds,
    projects,
    materialRecords,
    reviewerName,
    setReviewerName,
    reviewNote,
    setReviewNote,
    prevStep,
    submitAll,
    validations,
    setCurrentStep,
  } = useAppStore();
  const validation = validations.find((v) => v.step === 4);
  const [showConfirm, setShowConfirm] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('gap');
  const [roleForReview, setRoleForReview] = useState('');

  const projectNames = projects
    .filter((p) => selectedProjectIds.includes(p.id))
    .map((p) => p.name);

  const totalExpected = materialRecords.reduce((s, r) => s + r.expectedQuantity, 0);
  const totalActual = materialRecords.reduce((s, r) => s + r.actualQuantity, 0);
  const totalArrived = materialRecords.filter((r) => r.status === 'arrived').length;
  const arrivedRate = materialRecords.length > 0 ? Math.round((totalArrived / materialRecords.length) * 100) : 0;

  const groupedProblems = useMemo(() => {
    const byGap: Record<GapLevel, typeof materialRecords> = {
      none: [], low: [], medium: [], high: [],
    };
    const byStatus: Record<MaterialStatus, typeof materialRecords> = {
      pending: [], arrived: [], need_supply: [], need_review: [], suspended: [],
    };
    materialRecords.forEach((r) => {
      byGap[r.gapLevel].push(r);
      byStatus[r.status].push(r);
    });
    return { byGap, byStatus };
  }, [materialRecords]);

  const canSubmit = !validation?.hasError && reviewerName.trim().length > 0;

  const problemSections = [
    {
      key: 'gap-high',
      title: `严重缺口材料（${groupedProblems.byGap.high.length}项）`,
      subtitle: '缺口率 >30%，建议立即补充',
      records: groupedProblems.byGap.high,
      tone: 'red',
      Icon: AlertOctagon,
    },
    {
      key: 'gap-medium',
      title: `中等缺口材料（${groupedProblems.byGap.medium.length}项）`,
      subtitle: '缺口率 10%~30%，需尽快处理',
      records: groupedProblems.byGap.medium,
      tone: 'amber',
      Icon: AlertTriangle,
    },
    {
      key: 'suspended',
      title: `暂停使用器材（${groupedProblems.byStatus.suspended.length}项）`,
      subtitle: '存在损坏需维修或报废',
      records: groupedProblems.byStatus.suspended,
      tone: 'red',
      Icon: Pause,
    },
    {
      key: 'need_supply',
      title: `需补充器材（${groupedProblems.byStatus.need_supply.length}项）`,
      subtitle: '需尽快补充到位',
      records: groupedProblems.byStatus.need_supply,
      tone: 'amber',
      Icon: Package,
    },
    {
      key: 'need_review',
      title: `待复核材料（${groupedProblems.byStatus.need_review.length}项）`,
      subtitle: '需进一步确认状态',
      records: groupedProblems.byStatus.need_review,
      tone: 'sky',
      Icon: ShieldCheck,
    },
    {
      key: 'pending',
      title: `未核对材料（${groupedProblems.byStatus.pending.length}项）`,
      subtitle: '仍处于待核对状态',
      records: groupedProblems.byStatus.pending,
      tone: 'slate',
      Icon: Package,
    },
  ];

  const sectionsWithData = problemSections.filter((s) => s.records.length > 0);

  const handleConfirmSubmit = () => {
    submitAll();
    setShowConfirm(false);
    setTimeout(() => navigate('/result'), 300);
  };

  const toneStyles: Record<string, { border: string; bg: string; text: string; iconBg: string }> = {
    red: {
      border: 'border-red-200',
      bg: 'bg-red-50/50 hover:bg-red-50',
      text: 'text-red-700',
      iconBg: 'bg-red-100 text-red-600',
    },
    amber: {
      border: 'border-amber-200',
      bg: 'bg-amber-50/50 hover:bg-amber-50',
      text: 'text-amber-700',
      iconBg: 'bg-amber-100 text-amber-600',
    },
    sky: {
      border: 'border-sky-200',
      bg: 'bg-sky-50/50 hover:bg-sky-50',
      text: 'text-sky-700',
      iconBg: 'bg-sky-100 text-sky-600',
    },
    slate: {
      border: 'border-slate-200',
      bg: 'bg-slate-50/50 hover:bg-slate-50',
      text: 'text-slate-700',
      iconBg: 'bg-slate-100 text-slate-600',
    },
  };

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-6 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800">复核确认</h2>
            <p className="mt-1 text-sm text-slate-500">
              请最终复核所有核对信息，确认无误后提交；提交后可查看或打印结果报告
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="材料种类" value={materialRecords.length} unit="项" icon={Package} color="slate" />
          <StatCard label="器材总数" value={totalExpected} unit="件" icon={Package} color="indigo" />
          <StatCard label="实到件数" value={totalActual} unit="件" icon={CheckCircle2} color="emerald" />
          <StatCard label="到位率" value={arrivedRate} unit="%" icon={ShieldCheck} color="sky" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Section title="活动信息概览" icon={FileText}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoRow icon={FileText} label="活动名称" value={activityInfo.name || '—'} />
              <InfoRow icon={CalendarDays} label="体测日期" value={activityInfo.date ? formatDate(activityInfo.date) : '—'} />
              <InfoRow icon={MapPin} label="举办地点" value={activityInfo.location || '—'} />
              <InfoRow icon={User} label="总负责人" value={activityInfo.manager || '—'} />
            </div>
            {activityInfo.remark && (
              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                <span className="font-bold text-slate-700">备注说明：</span>{activityInfo.remark}
              </div>
            )}
          </Section>

          <Section title="参与项目" icon={Package}>
            <div className="flex flex-wrap gap-2">
              {projectNames.length > 0 ? projectNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                  {name}
                </span>
              )) : (
                <span className="text-xs text-slate-400">未选择项目</span>
              )}
            </div>
          </Section>

          <Section title="问题分类清单" icon={AlertTriangle}>
            {sectionsWithData.length === 0 ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <PartyPopper className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="font-bold text-emerald-700">太棒了！没有发现任何问题</p>
                <p className="mt-1 text-xs text-emerald-600/80">所有材料均已到位且核对完成</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sectionsWithData.map((section) => {
                  const expanded = expandedSection === section.key;
                  const { Icon } = section;
                  const tone = toneStyles[section.tone];
                  return (
                    <div
                      key={section.key}
                      className={cn('rounded-xl border overflow-hidden transition-all', tone.border)}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedSection(expanded ? null : section.key)}
                        className={cn(
                          'flex w-full items-center justify-between gap-3 px-4 py-3 transition-colors',
                          tone.bg,
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', tone.iconBg)}>
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <div className="text-left">
                            <p className={cn('text-sm font-bold', tone.text)}>{section.title}</p>
                            <p className="text-xs text-slate-500">{section.subtitle}</p>
                          </div>
                        </div>
                        {expanded ? (
                          <ChevronDown className={cn('h-5 w-5', tone.text)} />
                        ) : (
                          <ChevronRight className={cn('h-5 w-5', tone.text)} />
                        )}
                      </button>
                      {expanded && (
                        <div className="max-h-72 overflow-y-auto border-t border-slate-100 bg-white">
                          <table className="w-full">
                            <thead className="bg-slate-50/60 text-xs text-slate-500">
                              <tr>
                                <th className="px-4 py-2 text-left font-medium">材料名称</th>
                                <th className="px-4 py-2 text-center font-medium">应/实</th>
                                <th className="px-4 py-2 text-center font-medium">缺口</th>
                                <th className="px-4 py-2 text-left font-medium">负责/存放</th>
                                <th className="px-4 py-2 text-left font-medium">说明</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-xs">
                              {section.records.map((r) => (
                                <tr key={r.id} className="hover:bg-slate-50/50">
                                  <td className="px-4 py-2.5">
                                    <p className="font-medium text-slate-700">{r.name}</p>
                                    <p className="text-[10px] text-slate-400">{r.projectName}</p>
                                  </td>
                                  <td className="px-4 py-2.5 text-center font-mono tabular-nums">
                                    <span className="text-slate-500">{r.expectedQuantity}</span>
                                    <span className="mx-1 text-slate-300">/</span>
                                    <span className={cn('font-bold', r.actualQuantity < r.expectedQuantity ? 'text-red-600' : 'text-emerald-600')}>
                                      {r.actualQuantity}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2.5 text-center">
                                    <GapTag level={r.gapLevel} className="!text-[10px] !py-0.5" />
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <p className="text-slate-600">{r.responsibleGroup || '—'}</p>
                                    <p className="text-[10px] text-slate-400">{r.location || '—'}</p>
                                  </td>
                                  <td className="px-4 py-2.5 max-w-[180px]">
                                    <p className="truncate text-slate-500" title={r.damageNote}>
                                      {r.damageNote || '—'}
                                    </p>
                                    <div className="mt-0.5"><StatusTag status={r.status} showDot className="!text-[10px] !py-0" /></div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        </div>

        <div className="space-y-4">
          <Section title="复核人信息" icon={ShieldCheck}>
            <div className="space-y-4">
              <Input
                label="复核人姓名"
                placeholder="请输入您的姓名"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                required
                leftIcon={<User className="h-4 w-4" />}
                error={validation?.errors.find((e) => e.field === 'reviewerName')?.message}
              />
              <Select
                label="复核人角色"
                placeholder="请选择身份"
                value={roleForReview}
                onChange={(e) => setRoleForReview(e.target.value)}
                options={[
                  { value: 'teacher', label: '体测负责老师' },
                  { value: 'staff', label: '器材管理员' },
                  { value: 'student', label: '学生负责人' },
                  { value: 'other', label: '其他人员' },
                ]}
              />
              <Textarea
                label="复核意见（选填）"
                placeholder="可填写总体评价、改进建议、特殊说明等..."
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                rows={4}
              />
            </div>
          </Section>

          {validation && (validation.hasError || validation.hasWarning) && (
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
              <h4 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-red-700">
                <AlertOctagon className="h-4 w-4" />
                以下问题需修正后才可提交
              </h4>
              <ul className="space-y-1.5">
                {validation.errors.map((e, i) => (
                  <li key={`err-${i}`} className="text-xs text-red-600 flex items-start gap-1.5 cursor-pointer hover:underline" onClick={() => {
                    if (e.field === 'step1') setCurrentStep(1);
                    else if (e.field === 'step2') setCurrentStep(2);
                    else if (e.field === 'step3') setCurrentStep(3);
                  }}>
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    <span>{e.message} <span className="opacity-60">（点击跳转）</span></span>
                  </li>
                ))}
                {validation.warnings.map((w, i) => (
                  <li key={`warn-${i}`} className="text-xs text-amber-600 flex items-start gap-1.5">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span>{w.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-500">材料总数</span>
              <span className="font-bold text-slate-700">{materialRecords.length} 项</span>
            </div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-emerald-600">● 已到位</span>
              <span className="font-bold text-emerald-700">{totalArrived} 项</span>
            </div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-amber-600">● 有问题</span>
              <span className="font-bold text-amber-700">{problemSections.slice(0, 4).reduce((s, x) => s + x.records.length, 0)} 项</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-600">● 按缺口(高中低)</span>
              <span className="font-bold text-sky-700">
                {groupedProblems.byGap.high.length}/{groupedProblems.byGap.medium.length}/{groupedProblems.byGap.low.length}
              </span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full overflow-hidden bg-slate-200 flex">
              <div className="bg-emerald-500" style={{ width: `${(groupedProblems.byStatus.arrived.length / Math.max(1, materialRecords.length)) * 100}%` }} />
              <div className="bg-amber-500" style={{ width: `${((groupedProblems.byStatus.need_supply.length + groupedProblems.byStatus.need_review.length) / Math.max(1, materialRecords.length)) * 100}%` }} />
              <div className="bg-red-500" style={{ width: `${(groupedProblems.byStatus.suspended.length / Math.max(1, materialRecords.length)) * 100}%` }} />
              <div className="bg-slate-400" style={{ width: `${(groupedProblems.byStatus.pending.length / Math.max(1, materialRecords.length)) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
        <Button variant="secondary" size="lg" onClick={prevStep}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          上一步：返回核对
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            打印预览
          </Button>
          <Button
            size="lg"
            onClick={() => setShowConfirm(true)}
            disabled={!canSubmit}
          >
            <ShieldCheck className="h-4 w-4" />
            确认提交
          </Button>
        </div>
      </div>

      <Modal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="确认提交核对结果？"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>
              再检查一下
            </Button>
            <Button variant="primary" onClick={handleConfirmSubmit}>
              <PartyPopper className="h-4 w-4" />
              确认提交
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            提交后将生成核对结果报告，您可以打印或截图留存。由于本系统运行于会话模式，<span className="font-bold text-amber-600">刷新页面后数据将清空</span>，请务必妥善保存结果。
          </p>
          <div className="rounded-xl bg-slate-50 p-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 text-xs">活动名称</span>
                <p className="font-medium text-slate-800 truncate">{activityInfo.name || '—'}</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">核对材料</span>
                <p className="font-medium text-slate-800">{materialRecords.length} 项 / {totalExpected} 件</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">复核人</span>
                <p className="font-medium text-slate-800">{reviewerName || '—'}</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">完成进度</span>
                <p className="font-medium text-slate-800">{arrivedRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
          <Icon className="h-4 w-4 text-slate-600" />
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function StatCard({ label, value, unit, icon: Icon, color }: { label: string; value: number; unit: string; icon: any; color: string }) {
  const colorMap: Record<string, string> = {
    slate: 'from-slate-700 to-slate-900',
    indigo: 'from-indigo-500 to-indigo-700',
    emerald: 'from-emerald-500 to-emerald-700',
    sky: 'from-sky-500 to-sky-700',
  };
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colorMap[color]} p-4 text-white shadow-sm`}>
      <div className="absolute -right-2 -top-2 opacity-10">
        <Icon className="h-16 w-16" />
      </div>
      <div className="relative">
        <p className="text-xs font-medium text-white/75">{label}</p>
        <p className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-extrabold tracking-tight">{value}</span>
          <span className="text-xs font-medium text-white/75">{unit}</span>
        </p>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg bg-slate-50/80 px-3 py-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-slate-500">{label}</p>
        <p className="truncate text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
