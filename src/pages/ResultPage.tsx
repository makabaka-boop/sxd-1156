import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/common/Button';
import { StatusTag, GapTag, RoleTag } from '@/components/common/Tag';
import {
  CheckCircle2, ShieldCheck, Printer, RotateCcw, Download, Home,
  Package, CalendarDays, MapPin, User, FileText, AlertTriangle, PartyPopper,
  Flag, UserCheck, CalendarClock, MessageSquare,
} from 'lucide-react';
import { formatDate, cn, isAbnormal, followUpStatusLabels, followUpStatusColors, followUpStatusDotColors } from '@/utils/helpers';
import { gapLevelLabels } from '@/utils/gapCalculator';

export default function ResultPage() {
  const navigate = useNavigate();
  const {
    activityInfo,
    selectedProjectIds,
    projects,
    materialRecords,
    reviewerName,
    reviewNote,
    isSubmitted,
    role,
  } = useAppStore();
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    if (!isSubmitted) {
      navigate('/', { replace: true });
      return;
    }
    const colors = ['#10b981', '#f97316', '#3b82f6', '#8b5cf6', '#ef4444', '#0ea5e9', '#f59e0b'];
    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.8,
    }));
    setConfetti(pieces);
  }, [isSubmitted, navigate]);

  const projectNames = projects.filter((p) => selectedProjectIds.includes(p.id)).map((p) => p.name);
  const totalExpected = materialRecords.reduce((s, r) => s + r.expectedQuantity, 0);
  const totalActual = materialRecords.reduce((s, r) => s + r.actualQuantity, 0);
  const arrivedItems = materialRecords.filter((r) => r.status === 'arrived').length;
  const arrivedRate = materialRecords.length > 0 ? Math.round((arrivedItems / materialRecords.length) * 100) : 0;

  const gapCounts = {
    high: materialRecords.filter((r) => r.gapLevel === 'high').length,
    medium: materialRecords.filter((r) => r.gapLevel === 'medium').length,
    low: materialRecords.filter((r) => r.gapLevel === 'low').length,
  };
  const problemRecords = materialRecords.filter(
    (r) => r.status === 'need_supply' || r.status === 'suspended' || r.status === 'need_review' || r.gapLevel !== 'none',
  );

  const submitTime = new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40">
      <style>{`
        @keyframes fall {
          to { transform: translateY(110vh) rotate(720deg); }
        }
      `}</style>
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="absolute h-2.5 w-2.5 rounded-sm"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              backgroundColor: c.color,
              animation: `fall ${2 + Math.random() * 2}s ${c.delay}s cubic-bezier(.15,.46,.5,.93) forwards`,
            }}
          />
        ))}
      </div>

      <header className="border-b border-slate-200/60 bg-white/70 backdrop-blur-lg">
        <div className="mx-auto max-w-4xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-600/20">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">核对结果报告</h1>
              <p className="text-xs text-slate-500">Verification Report</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              打印
            </Button>
            <Link to="/">
              <Button variant="secondary" size="sm">
                <RotateCcw className="h-4 w-4" />
                返回首页
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 pb-24">
        <div className="relative mb-8 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-10 shadow-xl shadow-emerald-500/10 overflow-hidden">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-400/10 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-gradient-to-br from-sky-400/15 to-indigo-400/10 blur-3xl" />
          <div className="relative flex flex-col items-center text-center">
            <div className="relative mb-5">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" style={{ animationDuration: '2.5s' }} />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/40">
                <PartyPopper className="h-10 w-10 text-white" strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              核对流程已完成！
            </h2>
            <p className="mt-2 text-slate-600">
              体测材料核对结果已生成，请打印或截图保存报告
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-full bg-white/80 backdrop-blur border border-emerald-200 px-4 py-1.5 text-xs font-medium text-emerald-700 shadow-sm">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                提交时间：{submitTime.toLocaleString('zh-CN')}
              </div>
              <RoleTag role={role} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
          <ResultStat label="材料种类" value={materialRecords.length} unit="项" color="slate" />
          <ResultStat label="器材总数" value={totalExpected} unit="件" color="indigo" />
          <ResultStat label="实到件数" value={totalActual} unit="件" color="emerald" />
          <ResultStat label="材料到位率" value={arrivedRate} unit="%" color="sky" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-8">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                <FileText className="h-3.5 w-3.5" />
              </span>
              活动信息
            </h3>
            <dl className="space-y-3 text-sm">
              <InfoDl icon={FileText} label="活动名称" value={activityInfo.name || '—'} />
              <InfoDl icon={CalendarDays} label="体测日期" value={activityInfo.date ? formatDate(activityInfo.date) : '—'} />
              <InfoDl icon={MapPin} label="举办地点" value={activityInfo.location || '—'} />
              <InfoDl icon={User} label="总负责人" value={activityInfo.manager || '—'} />
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
              复核信息
            </h3>
            <dl className="space-y-3 text-sm">
              <InfoDl icon={User} label="复核人" value={reviewerName || '—'} />
              <InfoDl icon={Package} label="参与项目" value={projectNames.join('、') || '—'} />
              <InfoDl icon={CheckCircle2} label="材料到位" value={`${arrivedItems} / ${materialRecords.length} 项`} />
              {reviewNote && (
                <div className="mt-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                  <p className="mb-1 font-bold text-slate-700">复核意见：</p>
                  {reviewNote}
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                <Package className="h-3.5 w-3.5" />
              </span>
              材料核对明细
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-500">
                严重缺口：<span className="font-bold text-red-600">{gapCounts.high}</span>
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                中等缺口：<span className="font-bold text-orange-600">{gapCounts.medium}</span>
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                少量缺口：<span className="font-bold text-amber-600">{gapCounts.low}</span>
              </span>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full min-w-[950px] text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">材料/项目</th>
                  <th className="px-4 py-3 text-center font-semibold w-28">应到</th>
                  <th className="px-4 py-3 text-center font-semibold w-28">实到</th>
                  <th className="px-4 py-3 text-center font-semibold w-28">缺口</th>
                  <th className="px-4 py-3 text-left font-semibold w-24">小组</th>
                  <th className="px-4 py-3 text-left font-semibold">存放点</th>
                  <th className="px-4 py-3 text-center font-semibold w-24">状态</th>
                  <th className="px-4 py-3 text-left font-semibold">说明</th>
                  <th className="px-4 py-3 text-left font-semibold w-32">跟进状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {materialRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/40">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{r.name}</p>
                      <p className="text-xs text-slate-400">{r.projectName}</p>
                    </td>
                    <td className="px-4 py-3 text-center font-mono tabular-nums">{r.expectedQuantity}</td>
                    <td className={`px-4 py-3 text-center font-mono font-bold tabular-nums ${r.actualQuantity < r.expectedQuantity ? 'text-red-600' : 'text-emerald-600'}`}>
                      {r.actualQuantity}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <GapTag level={r.gapLevel} className="!text-[10px] !py-0.5" />
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{r.responsibleGroup || '—'}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{r.location || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusTag status={r.status} showDot className="!text-[10px] !py-0.5" />
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-[150px] truncate" title={r.damageNote}>
                      {r.damageNote || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {r.followUp ? (
                        <div className="space-y-0.5">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border',
                              followUpStatusColors[r.followUp.status],
                            )}
                          >
                            <span className={cn('w-1 h-1 rounded-full', followUpStatusDotColors[r.followUp.status])} />
                            {followUpStatusLabels[r.followUp.status]}
                          </span>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <UserCheck className="h-3 w-3 shrink-0" />
                            {r.followUp.person}
                          </p>
                        </div>
                      ) : (
                        isAbnormal(r) ? (
                          <span className="text-[10px] text-red-500 font-medium">未设置</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">—</span>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {problemRecords.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-amber-700 uppercase tracking-wider">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
                <AlertTriangle className="h-3.5 w-3.5" />
              </span>
              需关注问题清单（{problemRecords.length}项）
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {problemRecords.map((r) => (
                <div key={r.id} className="rounded-xl border border-white bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{r.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{r.projectName}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <GapTag level={r.gapLevel} className="!text-[10px] !px-1.5 !py-0" />
                      <StatusTag status={r.status} showDot={false} className="!text-[10px] !px-1.5 !py-0" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                    <span>应到 <b className="text-slate-700">{r.expectedQuantity}</b></span>
                    <span>实到 <b className={r.actualQuantity < r.expectedQuantity ? 'text-red-600' : 'text-emerald-600'}>{r.actualQuantity}</b></span>
                    <span>缺口 <b className="text-amber-600">{r.expectedQuantity - r.actualQuantity}</b></span>
                  </div>
                  {r.damageNote && (
                    <p className="mt-2 text-[11px] text-slate-600 rounded-md bg-slate-50 px-2 py-1.5">
                      {r.damageNote}
                    </p>
                  )}
                  {r.followUp && (
                    <div className="mt-2 rounded-md bg-slate-50/80 border border-slate-100 px-2 py-1.5 space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border',
                            followUpStatusColors[r.followUp.status],
                          )}
                        >
                          <span className={cn('w-1 h-1 rounded-full', followUpStatusDotColors[r.followUp.status])} />
                          {followUpStatusLabels[r.followUp.status]}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500">
                        <span className="flex items-center gap-0.5">
                          <UserCheck className="h-3 w-3" />
                          {r.followUp.person}
                        </span>
                        {r.followUp.expectedTime && (
                          <span className="flex items-center gap-0.5">
                            <CalendarClock className="h-3 w-3" />
                            {r.followUp.expectedTime}
                          </span>
                        )}
                      </div>
                      {r.followUp.note && (
                        <p className="text-[10px] text-slate-500">{r.followUp.note}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {materialRecords.filter((r) => isAbnormal(r)).length > 0 && (
          <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50/50 via-white to-purple-50/30 p-6 shadow-sm mt-4">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-violet-700 uppercase tracking-wider">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
                <Flag className="h-3.5 w-3.5" />
              </span>
              异常跟进摘要
            </h3>
            {(() => {
              const abnormalRecords = materialRecords.filter((r) => isAbnormal(r));
              const pendingCount = abnormalRecords.filter((r) => !r.followUp || r.followUp.status === 'pending').length;
              const inProgressCount = abnormalRecords.filter((r) => r.followUp?.status === 'in_progress').length;
              const completedCount = abnormalRecords.filter((r) => r.followUp?.status === 'completed').length;
              const noFollowUpCount = abnormalRecords.filter((r) => !r.followUp).length;

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-center">
                      <p className="text-2xl font-bold text-red-700">{pendingCount}</p>
                      <p className="text-xs text-red-600 mt-1">待跟进</p>
                    </div>
                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-center">
                      <p className="text-2xl font-bold text-amber-700">{inProgressCount}</p>
                      <p className="text-xs text-amber-600 mt-1">跟进中</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-700">{completedCount}</p>
                      <p className="text-xs text-emerald-600 mt-1">已完成</p>
                    </div>
                  </div>

                  {noFollowUpCount > 0 && (
                    <div className="rounded-lg bg-red-50/50 border border-red-200 p-3">
                      <p className="text-xs font-bold text-red-700 mb-1">
                        ⚠ {noFollowUpCount}项异常材料未设置跟进负责人
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {abnormalRecords.filter((r) => !r.followUp).map((r) => (
                          <span key={r.id} className="inline-flex items-center gap-1 rounded-full bg-white border border-red-200 px-2 py-0.5 text-[10px] text-red-600">
                            <StatusTag status={r.status} showDot className="!text-[9px] !py-0 !px-1" />
                            {r.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">材料</th>
                          <th className="px-4 py-3 text-center font-semibold">异常类型</th>
                          <th className="px-4 py-3 text-center font-semibold">跟进状态</th>
                          <th className="px-4 py-3 text-left font-semibold">负责人</th>
                          <th className="px-4 py-3 text-left font-semibold">预计时间</th>
                          <th className="px-4 py-3 text-left font-semibold">处理说明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {abnormalRecords.map((r) => {
                          const abnormalType = r.status === 'suspended' ? '暂停使用'
                            : r.status === 'need_supply' ? '需补充'
                            : r.status === 'need_review' ? '需复核'
                            : r.actualQuantity < r.expectedQuantity ? '数量不足' : '—';
                          return (
                            <tr key={r.id} className="hover:bg-slate-50/40">
                              <td className="px-4 py-3">
                                <p className="font-medium text-slate-800">{r.name}</p>
                                <p className="text-xs text-slate-400">{r.projectName}</p>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <StatusTag status={r.status} showDot className="!text-[10px] !py-0.5" />
                              </td>
                              <td className="px-4 py-3 text-center">
                                {r.followUp ? (
                                  <span
                                    className={cn(
                                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border',
                                      followUpStatusColors[r.followUp.status],
                                    )}
                                  >
                                    <span className={cn('w-1 h-1 rounded-full', followUpStatusDotColors[r.followUp.status])} />
                                    {followUpStatusLabels[r.followUp.status]}
                                  </span>
                                ) : (
                                  <span className="text-xs text-red-500 font-medium">未设置</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-xs text-slate-600">
                                {r.followUp?.person || '—'}
                              </td>
                              <td className="px-4 py-3 text-xs text-slate-600">
                                {r.followUp?.expectedTime || '—'}
                              </td>
                              <td className="px-4 py-3 text-xs text-slate-500 max-w-[200px] truncate" title={r.followUp?.note}>
                                {r.followUp?.note || '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400">
            —— 本报告由「体测材料核对系统」于会话内生成 ——
          </p>
          <p className="mt-1 text-xs text-slate-300">
            请妥善保存纸质/截图版本，刷新页面后数据将清空
          </p>
        </div>
      </main>
    </div>
  );
}

function ResultStat({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  const map: Record<string, string> = {
    slate: 'from-slate-600 to-slate-800 shadow-slate-600/20',
    indigo: 'from-indigo-500 to-indigo-700 shadow-indigo-500/30',
    emerald: 'from-emerald-500 to-emerald-700 shadow-emerald-500/30',
    sky: 'from-sky-500 to-sky-700 shadow-sky-500/30',
  };
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${map[color]} p-5 text-white shadow-lg`}>
      <p className="text-xs font-medium text-white/80">{label}</p>
      <p className="mt-1 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold tracking-tight">{value}</span>
        <span className="text-sm text-white/80">{unit}</span>
      </p>
    </div>
  );
}

function InfoDl({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-slate-500">{label}</p>
        <p className="break-words text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
