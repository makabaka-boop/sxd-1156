import { useMemo } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Input, Select } from '@/components/common/Input';
import { StatusTag, GapTag } from '@/components/common/Tag';
import { EmptyState } from '@/components/common/EmptyState';
import { cn, statusLabels } from '@/utils/helpers';
import type { MaterialRecord, MaterialStatus } from '@/types';
import { Check, Minus, Plus, AlertCircle } from 'lucide-react';

interface MaterialRowProps {
  record: MaterialRecord;
  selected: boolean;
  onToggleSelect: () => void;
  recordErrors: { field: string; message: string }[];
  recordWarnings: { field: string; message: string }[];
  presetGroups: string[];
  onUpdate: (updates: Partial<MaterialRecord>) => void;
}

function MaterialRow({
  record,
  selected,
  onToggleSelect,
  recordErrors,
  recordWarnings,
  presetGroups,
  onUpdate,
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

  return (
    <tr
      className={cn(
        'group border-b border-slate-100 transition-colors hover:bg-slate-50/60',
        selected && 'bg-sky-50/60 hover:bg-sky-50',
        hasAnyError && 'bg-red-50/30',
      )}
    >
      <td className="sticky left-0 z-10 bg-inherit px-3 py-4 w-10">
        <label className="flex cursor-pointer items-center justify-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-800 focus:ring-slate-800/20"
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
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg border transition-colors',
              record.actualQuantity <= 0
                ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100',
            )}
            disabled={record.actualQuantity <= 0}
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <input
            type="number"
            min={0}
            value={record.actualQuantity}
            onChange={(e) => onUpdate({ actualQuantity: Math.max(0, parseInt(e.target.value) || 0) })}
            className={cn(
              'w-16 rounded-lg border px-2 py-1.5 text-center text-sm font-bold transition-all',
              fieldHasError('actualQuantity')
                ? 'border-red-400 bg-red-50 text-red-700 focus:ring-2 focus:ring-red-500/20'
                : gapQty > 0
                  ? 'border-amber-300 bg-amber-50 text-amber-800 focus:ring-2 focus:ring-amber-500/20'
                  : 'border-slate-200 text-slate-800 focus:border-slate-400 focus:ring-2 focus:ring-slate-800/20',
            )}
          />
          <button
            type="button"
            onClick={() => onUpdate({ actualQuantity: record.actualQuantity + 1 })}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:bg-slate-100"
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
          error={fieldHasError('location') ? ' ' : undefined}
          className="!py-1.5 !text-xs"
        />
      </td>

      <td className="px-3 py-4 w-40">
        <Select
          value={record.status}
          onChange={(e) => onUpdate({ status: e.target.value as MaterialStatus })}
          options={statusList}
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
          className={cn(
            'flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
            record.status === 'arrived' && record.actualQuantity >= record.expectedQuantity
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-emerald-700 hover:bg-emerald-50',
          )}
          title="快速标记已到位（实到=应到）"
        >
          <Check className="h-3.5 w-3.5" />
          标记到位
        </button>
      </td>
    </tr>
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
  } = useAppStore();

  const step3Validation = validations.find((v) => v.step === 3);

  const filteredRecords = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase();
    return materialRecords.filter((r) => {
      if (filters.projectIds.length > 0 && !filters.projectIds.includes(r.projectId)) return false;
      if (filters.groups.length > 0 && !filters.groups.includes(r.responsibleGroup)) return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(r.status)) return false;
      if (filters.gapLevels.length > 0 && !filters.gapLevels.includes(r.gapLevel)) return false;
      if (kw) {
        const hay = `${r.name} ${r.projectName} ${r.responsibleGroup} ${r.location} ${r.damageNote}`.toLowerCase();
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
        <table className="w-full min-w-[1400px] border-collapse">
          <thead className="sticky top-0 z-20 bg-gradient-to-b from-slate-50 to-slate-50/80 backdrop-blur border-b border-slate-200">
            <tr>
              <th className="sticky left-0 z-10 bg-inherit w-10 px-3 py-3.5">
                <label className="flex cursor-pointer items-center justify-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-800 focus:ring-slate-800/20"
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
        </div>
      </div>
    </div>
  );
}
