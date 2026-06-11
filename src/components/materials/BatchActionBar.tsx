import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/helpers';
import { CheckCircle, AlertTriangle, ShieldAlert, PauseCircle, Wand2, Layers } from 'lucide-react';
import type { MaterialStatus } from '@/types';

const actions: {
  status?: MaterialStatus;
  label: string;
  icon: typeof CheckCircle;
  className: string;
  actionType: 'status' | 'markArrived';
}[] = [
  {
    actionType: 'markArrived',
    label: '一键标记已到位',
    icon: Wand2,
    className: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-emerald-500/30',
  },
  {
    actionType: 'status',
    status: 'arrived',
    label: '已到位',
    icon: CheckCircle,
    className: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  },
  {
    actionType: 'status',
    status: 'need_supply',
    label: '需补充',
    icon: AlertTriangle,
    className: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  {
    actionType: 'status',
    status: 'need_review',
    label: '需复核',
    icon: ShieldAlert,
    className: 'bg-sky-500 hover:bg-sky-600 text-white',
  },
  {
    actionType: 'status',
    status: 'suspended',
    label: '暂停使用',
    icon: PauseCircle,
    className: 'bg-red-500 hover:bg-red-600 text-white',
  },
];

export function BatchActionBar() {
  const {
    selectedRecordIds,
    clearRecordSelection,
    batchUpdateStatus,
    batchMarkArrived,
    materialRecords,
  } = useAppStore();

  if (selectedRecordIds.length === 0) return null;

  const handleAction = (action: typeof actions[0]) => {
    if (action.actionType === 'markArrived') {
      batchMarkArrived(selectedRecordIds);
    } else if (action.status) {
      batchUpdateStatus(selectedRecordIds, action.status);
    }
  };

  const selectedNames = materialRecords
    .filter((r) => selectedRecordIds.includes(r.id))
    .map((r) => r.name);

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-8 duration-300">
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-800/10 bg-slate-900 px-5 py-3 shadow-2xl shadow-slate-900/30 backdrop-blur">
          <div className="mr-2 flex items-center gap-2 border-r border-white/10 pr-4 text-white">
            <Layers className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium">
              已选择 <span className="text-amber-400 font-bold text-base">{selectedRecordIds.length}</span> 项
            </span>
          </div>
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={`${action.actionType}-${action.status || 'all'}`}
                variant="primary"
                size="sm"
                className={cn('shadow-none', action.className)}
                onClick={() => handleAction(action)}
              >
                <Icon className="h-4 w-4" />
                {action.label}
              </Button>
            );
          })}
          <div className="ml-2 border-l border-white/10 pl-3">
            <button
              type="button"
              onClick={clearRecordSelection}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              取消选择
            </button>
          </div>
        </div>

        <div className="max-w-[80vw] truncate rounded-full bg-white/90 px-4 py-1 text-xs text-slate-500 shadow-sm backdrop-blur">
          <span className="text-slate-400">选中：</span>
          {selectedNames.slice(0, 5).join('、')}
          {selectedNames.length > 5 && ` 等${selectedNames.length}项`}
        </div>
      </div>
    </div>
  );
}
