import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { RoleTag } from '@/components/common/Tag';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ClipboardCheck, Settings2, RotateCcw, ShieldCheck, ClipboardList, AlertTriangle, Wrench } from 'lucide-react';
import { cn } from '@/utils/helpers';
import type { UserRole } from '@/types';

const roleOptions: { value: UserRole; label: string; icon: typeof Wrench; desc: string }[] = [
  { value: 'manager', label: '管理者', icon: Settings2, desc: '配置体测项目与材料清单' },
  { value: 'executor', label: '执行者', icon: ClipboardList, desc: '填写材料到位与损坏信息' },
  { value: 'reviewer', label: '复核者', icon: ShieldCheck, desc: '确认最终核对结果' },
];

export function Header() {
  const {
    role,
    setRole,
    toggleManagerPanel,
    showManagerPanel,
    resetAll,
    isSubmitted,
  } = useAppStore();
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-[1400px] px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 shadow-lg shadow-slate-800/20">
                  <ClipboardCheck className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                  体测材料核对系统
                </h1>
                <p className="text-xs text-slate-500">Physical Test Material Verification System</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
              {roleOptions.map((opt) => {
                const Icon = opt.icon;
                const active = role === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setRole(opt.value)}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700',
                    )}
                    title={opt.desc}
                  >
                    <Icon className={cn('h-4 w-4')} />
                    <span>{opt.label}</span>
                    {active && <RoleTag role={opt.value} className="ml-1 !py-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              {role === 'manager' && (
                <Button
                  variant={showManagerPanel ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => toggleManagerPanel()}
                >
                  <Settings2 className="h-4 w-4" />
                  {showManagerPanel ? '关闭配置' : '项目配置'}
                </Button>
              )}
              <Button
                variant="ghost"
                size="md"
                onClick={() => setShowResetModal(true)}
                disabled={isSubmitted}
              >
                <RotateCcw className="h-4 w-4" />
                重置会话
              </Button>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2">
            <div className="flex items-center gap-2 text-xs text-amber-700">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>
                <span className="font-medium">会话模式：</span>
                所有数据仅保存在当前浏览器会话中，刷新页面后将清空。建议完成后截图或打印结果页面留存记录。
              </span>
            </div>
          </div>
        </div>
      </header>

      <Modal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="确认重置当前会话？"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowResetModal(false)}>
              取消
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                resetAll();
                setShowResetModal(false);
              }}
            >
              确认重置
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          重置将清空所有已填写的活动信息、项目选择和材料核对记录，此操作不可恢复。
        </p>
      </Modal>
    </>
  );
}
