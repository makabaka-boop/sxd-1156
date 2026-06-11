import { useMemo, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Input, Select } from '@/components/common/Input';
import { StatusTag, GapTag } from '@/components/common/Tag';
import { EmptyState } from '@/components/common/EmptyState';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { cn, statusLabels, isAbnormal, followUpStatusLabels, followUpStatusColors, followUpStatusDotColors, formatDate } from '@/utils/helpers';
import type { MaterialRecord, MaterialStatus, FollowUpStatus, FollowUpInfo } from '@/types';
import { Check, Minus, Plus, AlertCircle, UserCheck, CalendarClock, MessageSquare, Flag } from 'lucide-react';

interface MaterialRowProps {
  record: MaterialRecord;
  selected: boolean;
  onToggleSelect: () => void;
  recordErrors: { field: string; message: string }[];
  recordWarnings: { field: string; message: string }[];
  presetGroups: string[];
  onUpdate: (updates: Partial<MaterialRecord>) => void;
  readOnly?: boolean;
}

function MaterialRow({
  record,
  selected,
  onToggleSelect,
  recordErrors,
  recordWarnings,
  presetGroups,
  onUpdate,
  readOnly = false,
}: MaterialRowProps) {
  const hasAnyError = recordErrors.length > 0;
  const statusList = (Object.keys(statusLabels) as MaterialStatus[]).map((s) => ({
    value: s,
    label: statusLabels[s],
  }));
  const groupOptions = presetGroups.map((g) => ({ value: g, label: g }));

  const fieldHasError = (field: string) => recordErrors.some((e) => e.field === field);
  const fieldErrorMsg = (field: string) => recordErrors.find((e) => e.field === field)?.message;

  const gapQty = record.expectedQuantity - record.actualQuantity;
  const abnormal = isAbnormal(record);

  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpPerson, setFollowUpPerson] = useState(record.followUp?.person || '');
  const [followUpTime, setFollowUpTime] = useState(record.followUp?.expectedTime || '');
  const [followUpNote, setFollowUpNote] = useState(record.followUp?.note || '');
  const [followUpStatus, setFollowUpStatus] = useState<FollowUpStatus>(record.followUp?.status || 'pending');

  const followUpStatusList = (Object.keys(followUpStatusLabels) as FollowUpStatus[]).map((s) => ({
    value: s,
    label: followUpStatusLabels[s],
  }));

  const handleFollowUpSave = () => {
    onUpdate({
      followUp: {
        person: followUpPerson,
        expectedTime: followUpTime,
        note: followUpNote,
        status: followUpStatus,
      },
    });
    setShowFollowUpModal(false);
  };

  return (
    <>
      <tr
        className={cn(
          'group border-b border-slate-100 transition-colors hover:bg-slate-50/60',
          selected && 'bg-sky-50/60 hover:bg-sky-50',
          hasAnyError && 'bg-red-50/30',
          abnormal && !record.followUp?.person && 'bg-red-50/20',
        )}
      >
      <td className="sticky left-0 z-10 bg-inherit px-3 py-4 w-10">
        <label className={cn('flex items-center justify-center', !readOnly && 'cursor-pointer')}>
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            disabled={readOnly}
            className={cn(
              'h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-800/20',
              !readOnly && 'cursor-pointer',
              readOnly && 'opacity-60 cursor-not-allowed',
            )}
          />
        </label>
      </td>

      <td className="px-3 py-4">
        <div className="flex items-start gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-800">{record.name}</p>
            <p className="mt-0.5 text-xs text-slate-500">{record.projectName}</p>
          </div>
          {(recordErrors.length > 0 || recordWarnings.length > 0) && (
            <div className="group/err relative shrink-0">
              <AlertCircle
                className={cn(
                  'h-4 w-4 mt-0.5',
                  recordErrors.length > 0 ? 'text-red-500' : 'text-amber-500',
                )}
              />
              <div className="pointer-events-none absolute left-6 top-0 z-20 w-64 opacity-0 transition-opacity duration-200 group-hover/err:opacity-100 group-hover/err:pointer-events-auto">
                <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
                  {recordErrors.map((e, i) => (
                    <p key={`e-${i}`} className="flex items-start gap-1.5 text-xs text-red-600 mb-1">
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                      {e.message}
                    </p>
                  ))}
                  {recordWarnings.map((w, i) => (
                    <p key={`w-${i}`} className="flex items-start gap-1.5 text-xs text-amber-600 mb-1">
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {w.message}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </td>

      <td className="px-3 py-4 w-36">
        <div className="text-center">
          <span className="inline-block rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">
            {record.expectedQuantity}
          </span>
        </div>
      </td>

      <td className="px-3 py-4 w-40">
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onUpdate({ actualQuantity: Math.max(0, record.actualQuantity - 1) })}
            disabled={readOnly || record.actualQuantity <= 0}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg border transition-colors',
              record.actualQuantity <= 0 || readOnly
                ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100',
            )}
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <input
            type="number"
            min={0}
            value={record.actualQuantity}
            onChange={(e) => onUpdate({ actualQuantity: Math.max(0, parseInt(e.target.value) || 0) })}
            disabled={readOnly}
            className={cn(
              'w-16 rounded-lg border px-2 py-1.5 text-center text-sm font-bold transition-all',
              fieldHasError('actualQuantity')
                ? 'border-red-400 bg-red-50 text-red-700 focus:ring-2 focus:ring-red-500/20'
                : gapQty > 0
                  ? 'border-amber-300 bg-amber-50 text-amber-800 focus:ring-2 focus:ring-amber-500/20'
                  : 'border-slate-200 text-slate-800 focus:border-slate-400 focus:ring-2 focus:ring-slate-800/20',
              readOnly && '!bg-slate-50 !text-slate-600 !cursor-not-allowed',
            )}
          />
          <button
            type="button"
            onClick={() => onUpdate({ actualQuantity: record.actualQuantity + 1 })}
            disabled={readOnly}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg border transition-colors',
              readOnly
                ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100',
            )}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        {gapQty > 0 && (
          <p className="mt-1 text-center text-[11px] text-amber-600">
            缺 {gapQty}
          </p>
        )}
        {fieldHasError('actualQuantity') && (
          <p className="mt-1 text-center text-[11px] text-red-600">
            {fieldErrorMsg('actualQuantity')}
          </p>
        )}
      </td>

      <td className="px-3 py-4 w-24">
        <div className="flex justify-center">
          <GapTag level={record.gapLevel} />
        </div>
      </td>

      <td className="px-3 py-4 w-44">
        <Input
          value={record.responsibleGroup}
          onChange={(e) => onUpdate({ responsibleGroup: e.target.value })}
          placeholder="填写小组"
          disabled={readOnly}
          error={fieldHasError('responsibleGroup') ? ' ' : undefined}
          className="!py-1.5 !text-xs"
          list={`groups-${record.id}`}
        />
        <datalist id={`groups-${record.id}`}>
          {presetGroups.map((g) => (
            <option key={g} value={g} />
          ))}
        </datalist>
      </td>

      <td className="px-3 py-4 w-44">
        <Input
          value={record.location}
          onChange={(e) => onUpdate({ location: e.target.value })}
          placeholder="填写存放点"
          disabled={readOnly}
          error={fieldHasError('location') ? ' ' : undefined}
          className="!py-1.5 !text-xs"
        />
      </td>

      <td className="px-3 py-4 w-40">
        <Select
          value={record.status}
          onChange={(e) => onUpdate({ status: e.target.value as MaterialStatus })}
          options={statusList}
          disabled={readOnly}
          className="!py-1.5 !text-xs"
        />
      </td>

      <td className="px-3 py-4 w-56">
        <div className="relative">
          <Input
            value={record.damageNote}
            onChange={(e) => onUpdate({ damageNote: e.target.value })}
            placeholder={
              (record.status === 'suspended' || gapQty > 0)
                ? '必填：损坏/短缺说明'
                : '选填'
            }
            disabled={readOnly}
            error={fieldHasError('damageNote') ? ' ' : undefined}
            className={cn(
              '!py-1.5 !text-xs',
              (record.status === 'suspended' || gapQty > 0) && !record.damageNote && '!border-amber-300 !bg-amber-50/50',
            )}
          />
        </div>
      </td>

      <td className="px-3 py-4 w-28">
        <button
          type="button"
          onClick={() =>
            onUpdate({
              status: 'arrived',
              actualQuantity: record.expectedQuantity,
            })
          }
          disabled={readOnly || (record.status === 'arrived' && record.actualQuantity >= record.expectedQuantity)}
          className={cn(
            'flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
            record.status === 'arrived' && record.actualQuantity >= record.expectedQuantity
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-emerald-700 hover:bg-emerald-50',
            readOnly && 'cursor-not-allowed opacity-60',
          )}
          title="快速标记已到位（实到=应到）"
        >
          <Check className="h-3.5 w-3.5" />
          标记到位
        </button>
      </td>

      <td className="px-3 py-4 w-48">
        {abnormal ? (
          <div className="space-y-1.5">
            {record.followUp ? (
              <>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border',
                    followUpStatusColors[record.followUp.status],
                  )}
                >
                  <span className={cn('w-1.5 h-1.5 rounded-full', followUpStatusDotColors[record.followUp.status])} />
                  {followUpStatusLabels[record.followUp.status]}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-slate-600">
                  <UserCheck className="h-3 w-3 shrink-0 text-slate-400" />
                  <span className="truncate">{record.followUp.person || '—'}</span>
                </div>
                {record.followUp.expectedTime && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <CalendarClock className="h-3 w-3 shrink-0 text-slate-400" />
                    <span>{record.followUp.expectedTime}</span>
                  </div>
                )}
              </>
            ) : (
              <span className="text-[11px] text-red-500 font-medium">未设置跟进</span>
            )}
            {!readOnly && (
              <button
                type="button"
                onClick={() => {
                  setFollowUpPerson(record.followUp?.person || '');
                  setFollowUpTime(record.followUp?.expectedTime || '');
                  setFollowUpNote(record.followUp?.note || '');
                  setFollowUpStatus(record.followUp?.status || 'pending');
                  setShowFollowUpModal(true);
                }}
                className="flex items-center gap-1 text-[11px] text-sky-600 hover:text-sky-700 font-medium"
              >
                <Flag className="h-3 w-3" />
                {record.followUp ? '编辑跟进' : '设置跟进'}
              </button>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">—</span>
        )}
        {fieldHasError('followUpPerson') && (
          <p className="mt-0.5 text-[11px] text-red-600">
            {fieldErrorMsg('followUpPerson')}
          </p>
        )}
      </td>
    </tr>

    <Modal
      open={showFollowUpModal}
      onClose={() => setShowFollowUpModal(false)}
      title={`异常跟进 — ${record.name}`}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={() => setShowFollowUpModal(false)}>
            取消
          </Button>
          <Button variant="primary" onClick={handleFollowUpSave}>
            保存
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="跟进负责人"
          placeholder="请输入跟进负责人姓名"
          value={followUpPerson}
          onChange={(e) => setFollowUpPerson(e.target.value)}
          required
          leftIcon={<UserCheck className="h-4 w-4" />}
        />
        <Input
          label="预计处理时间"
          type="date"
          value={followUpTime}
          onChange={(e) => setFollowUpTime(e.target.value)}
          leftIcon={<CalendarClock className="h-4 w-4" />}
          hint="建议填写预计完成日期"
        />
        <div className="w-full space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            处理说明
          </label>
          <textarea
            value={followUpNote}
            onChange={(e) => setFollowUpNote(e.target.value)}
            placeholder="请描述处理方案、计划等..."
            rows={3}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-200 resize-y placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-400"
          />
        </div>
        <Select
          label="跟进状态"
          value={followUpStatus}
          onChange={(e) => setFollowUpStatus(e.target.value as FollowUpStatus)}
          options={followUpStatusList}
        />
      </div>
    </Modal>
    </>
  );
}

export function MaterialTable() {
  const {
    materialRecords,
    filters,
    selectedRecordIds,
    toggleRecordSelect,
    selectAllRecords,
    updateMaterialRecord,
    presetGroups,
    validations,
    role,
  } = useAppStore();

  const readOnly = role === 'reviewer';

  const step3Validation = validations.find((v) => v.step === 3);

  const filteredRecords = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase();
    return materialRecords.filter((r) => {
      if (filters.projectIds.length > 0 && !filters.projectIds.includes(r.projectId)) return false;
      if (filters.groups.length > 0 && !filters.groups.includes(r.responsibleGroup)) return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(r.status)) return false;
      if (filters.gapLevels.length > 0 && !filters.gapLevels.includes(r.gapLevel)) return false;
      if (filters.followUpStatuses.length > 0) {
        const fStatus = r.followUp?.status || null;
        if (!fStatus || !filters.followUpStatuses.includes(fStatus)) return false;
      }
      if (kw) {
        const hay = `${r.name} ${r.projectName} ${r.responsibleGroup} ${r.location} ${r.damageNote} ${r.followUp?.person || ''} ${r.followUp?.note || ''}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [materialRecords, filters]);

  const allSelected =
    filteredRecords.length > 0 && filteredRecords.every((r) => selectedRecordIds.includes(r.id));

  const toggleAll = () => {
    if (allSelected) {
      selectAllRecords([]);
    } else {
      selectAllRecords(filteredRecords.map((r) => r.id));
    }
  };

  if (materialRecords.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <EmptyState
          type="noData"
          title="暂无材料记录"
          description="请返回第二步选择体测项目，系统将自动加载对应材料清单。"
        />
      </div>
    );
  }

  if (filteredRecords.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <EmptyState
          type="noSearch"
          title="没有匹配的材料"
          description="当前筛选条件下没有找到记录，尝试调整筛选条件。"
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1700px] border-collapse">
          <thead className="sticky top-0 z-20 bg-gradient-to-b from-slate-50 to-slate-50/80 backdrop-blur border-b border-slate-200">
            <tr>
              <th className="sticky left-0 z-10 bg-inherit w-10 px-3 py-3.5">
                <label className={cn('flex items-center justify-center', !readOnly && 'cursor-pointer')}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    disabled={readOnly || filteredRecords.length === 0}
                    className={cn(
                      'h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-800/20',
                      !readOnly && 'cursor-pointer',
                      readOnly && 'opacity-60 cursor-not-allowed',
                    )}
                  />
                </label>
              </th>
              <th className="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                材料名称 · 项目
              </th>
              <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                应到数量
              </th>
              <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                实到数量
              </th>
              <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                缺口等级
              </th>
              <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                负责小组
              </th>
              <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                存放点
              </th>
              <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                处理状态
              </th>
              <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                损坏说明
              </th>
              <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                快捷操作
              </th>
              <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                异常跟进
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.map((record) => {
              const recErrors = step3Validation?.errors.filter((e) => e.recordId === record.id) || [];
              const recWarnings = step3Validation?.warnings.filter((w) => w.recordId === record.id) || [];
              return (
                <MaterialRow
                  key={record.id}
                  record={record}
                  selected={selectedRecordIds.includes(record.id)}
                  onToggleSelect={() => toggleRecordSelect(record.id)}
                  recordErrors={recErrors}
                  recordWarnings={recWarnings}
                  presetGroups={presetGroups}
                  onUpdate={(updates) => updateMaterialRecord(record.id, updates)}
                  readOnly={readOnly}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-xs text-slate-500">
        <div>
          显示 <span className="font-bold text-slate-700">{filteredRecords.length}</span> /{' '}
          <span className="font-bold text-slate-700">{materialRecords.length}</span> 条记录
        </div>
        <div className="flex items-center gap-4">
          {selectedRecordIds.length > 0 && (
            <span>
              已选 <span className="font-bold text-sky-600">{selectedRecordIds.length}</span> 条
            </span>
          )}
          <span className="flex items-center gap-1">
            <StatusTag status="pending" showDot />
            待核对：{materialRecords.filter((r) => r.status === 'pending').length}
          </span>
          <span className="flex items-center gap-1">
            <StatusTag status="arrived" showDot />
            已到位：{materialRecords.filter((r) => r.status === 'arrived').length}
          </span>
          <span className="flex items-center gap-1 text-xs text-red-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
            异常：{materialRecords.filter((r) => isAbnormal(r)).length}
          </span>
          <span className="flex items-center gap-1 text-xs text-amber-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
            待跟进：{materialRecords.filter((r) => isAbnormal(r) && r.followUp?.status === 'pending').length}
          </span>
        </div>
      </div>
    </div>
  );
}
