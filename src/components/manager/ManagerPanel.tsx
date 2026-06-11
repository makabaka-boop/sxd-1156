import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Tag';
import {
  Settings2, Plus, Trash2, ChevronRight, Package, Edit3, X, Check,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import type { SportsProject, MaterialTemplate } from '@/types';
import { generateId } from '@/utils/mockData';

const iconOptions = ['Ruler', 'Wind', 'Timer', 'Footprints', 'Dumbbell', 'StretchHorizontal', 'PersonStanding', 'Target', 'Medal', 'Trophy'];

export function ManagerPanel() {
  const {
    projects,
    addProject,
    removeProject,
    addMaterialToProject,
    removeMaterialTemplate,
    updateProject,
    showManagerPanel,
    toggleManagerPanel,
    presetGroups,
  } = useAppStore();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(projects[0]?.id || null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjIcon, setNewProjIcon] = useState(iconOptions[0]);
  const [addMaterialFor, setAddMaterialFor] = useState<string | null>(null);
  const [newMatName, setNewMatName] = useState('');
  const [newMatQty, setNewMatQty] = useState(1);
  const [newMatGroup, setNewMatGroup] = useState('');
  const [newMatLocation, setNewMatLocation] = useState('');
  const [editingProj, setEditingProj] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const handleAddProject = () => {
    if (!newProjName.trim()) return;
    addProject(newProjName.trim(), newProjIcon);
    setNewProjName('');
    setNewProjIcon(iconOptions[0]);
    setShowAddProject(false);
  };

  const handleAddMaterial = () => {
    if (!addMaterialFor || !newMatName.trim()) return;
    addMaterialToProject(addMaterialFor, newMatName.trim(), newMatQty, newMatGroup || undefined, newMatLocation || undefined);
    setNewMatName('');
    setNewMatQty(1);
    setNewMatGroup('');
    setNewMatLocation('');
    setAddMaterialFor(null);
  };

  if (!showManagerPanel) return null;

  return (
    <div className="mx-auto max-w-[1400px] mt-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-indigo-100 bg-white/70 backdrop-blur px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">项目与材料配置</h3>
              <p className="text-xs text-slate-500">管理者专属：增删体测项目，编辑各项目所需材料清单模板</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowAddProject(true)}>
              <Plus className="h-4 w-4" />
              新增项目
            </Button>
            <button
              type="button"
              onClick={() => toggleManagerPanel(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-0 min-h-[480px]">
          <div className="col-span-4 border-r border-slate-100 bg-white/50">
            <div className="border-b border-slate-100 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              项目列表（共{projects.length}项）
            </div>
            <div className="max-h-[440px] overflow-y-auto p-2">
              {projects.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">暂无项目，点击右上角新增</div>
              ) : (
                <ul className="space-y-1">
                  {projects.map((p) => {
                    const active = activeProjectId === p.id;
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => setActiveProjectId(p.id)}
                          className={cn(
                            'group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all',
                            active
                              ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 shadow-sm'
                              : 'hover:bg-slate-50 border border-transparent',
                          )}
                        >
                          <GripVertical className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                            active ? 'bg-white shadow-sm text-indigo-600' : 'bg-slate-100 text-slate-500',
                          )}>
                            <Package className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              {editingProj === p.id ? (
                                <div className="flex items-center gap-1 w-full">
                                  <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (editName.trim()) updateProject(p.id, { name: editName.trim() });
                                      setEditingProj(null);
                                    }}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className={cn('font-semibold truncate', active ? 'text-indigo-800' : 'text-slate-700')}>
                                    {p.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingProj(p.id);
                                      setEditName(p.name);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 hover:bg-white rounded transition-all"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </button>
                                </>
                              )}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5">
                              <Badge color={active ? 'indigo' : 'slate'}>
                                {p.materials.length}
                              </Badge>
                              <span className="text-[11px] text-slate-400">种材料</span>
                            </div>
                          </div>
                          <ChevronRight className={cn(
                            'h-4 w-4 transition-all',
                            active ? 'text-indigo-500 translate-x-0' : 'text-slate-300 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0',
                          )} />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`确定删除项目「${p.name}」？关联的材料记录也将一并删除`)) {
                                removeProject(p.id);
                                if (activeProjectId === p.id) {
                                  setActiveProjectId(projects.find((x) => x.id !== p.id)?.id || null);
                                }
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="col-span-8 bg-white">
            {!activeProject ? (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-slate-400">
                <Package className="h-14 w-14 opacity-30" />
                <p className="mt-3 text-sm">请从左侧选择项目进行编辑</p>
              </div>
            ) : (
              <>
                <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-800">{activeProject.name} · 材料清单</h4>
                    <p className="text-xs text-slate-500 mt-0.5">共 {activeProject.materials.length} 种材料 · 默认总数 {activeProject.materials.reduce((s, m) => s + m.defaultQuantity, 0)} 件</p>
                  </div>
                  <Button size="sm" variant="primary" onClick={() => setAddMaterialFor(activeProject.id)}>
                    <Plus className="h-4 w-4" />
                    新增材料
                  </Button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {activeProject.materials.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-sm">
                      暂无材料，点击上方新增
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-slate-50/80 sticky top-0 backdrop-blur">
                        <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                          <th className="text-left px-6 py-3 font-semibold w-10">#</th>
                          <th className="text-left px-3 py-3 font-semibold">材料名称</th>
                          <th className="text-center px-3 py-3 font-semibold w-28">默认数量</th>
                          <th className="text-left px-3 py-3 font-semibold w-36">负责小组</th>
                          <th className="text-left px-3 py-3 font-semibold">存放点</th>
                          <th className="text-center px-3 py-3 font-semibold w-16">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-sm">
                        {activeProject.materials.map((m, idx) => (
                          <MaterialRowEditor
                            key={m.id}
                            idx={idx}
                            template={m}
                            project={activeProject}
                            groups={presetGroups}
                            onRemove={() => removeMaterialTemplate(activeProject.id, m.id)}
                            onUpdate={(updates) => {
                              const newMats = activeProject.materials.map((x) =>
                                x.id === m.id ? { ...x, ...updates } : x,
                              );
                              updateProject(activeProject.id, { materials: newMats });
                            }}
                          />
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={showAddProject}
        onClose={() => setShowAddProject(false)}
        title="新增体测项目"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddProject(false)}>取消</Button>
            <Button variant="primary" onClick={handleAddProject} disabled={!newProjName.trim()}>
              确认添加
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="项目名称"
            placeholder="例如：引体向上"
            value={newProjName}
            onChange={(e) => setNewProjName(e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">项目图标</label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setNewProjIcon(ic)}
                  className={cn(
                    'flex items-center justify-center rounded-lg border-2 p-2.5 transition-all',
                    newProjIcon === ic
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white',
                  )}
                >
                  <Package className={cn(
                    'h-5 w-5',
                    newProjIcon === ic ? 'text-indigo-600' : 'text-slate-400',
                  )} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!addMaterialFor}
        onClose={() => setAddMaterialFor(null)}
        title="新增材料"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddMaterialFor(null)}>取消</Button>
            <Button variant="primary" onClick={handleAddMaterial} disabled={!newMatName.trim()}>
              确认添加
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="材料名称"
              placeholder="例如：电子秒表"
              value={newMatName}
              onChange={(e) => setNewMatName(e.target.value)}
              required
            />
          </div>
          <Input
            label="默认数量"
            type="number"
            min={1}
            value={String(newMatQty)}
            onChange={(e) => setNewMatQty(Math.max(1, parseInt(e.target.value) || 1))}
          />
          <Input
            label="默认负责小组"
            placeholder="选填"
            value={newMatGroup}
            onChange={(e) => setNewMatGroup(e.target.value)}
            list="preset-groups"
          />
          <datalist id="preset-groups">
            {presetGroups.map((g) => <option key={g} value={g} />)}
          </datalist>
          <div className="sm:col-span-2">
            <Input
              label="默认存放点"
              placeholder="选填，例如：体育馆A区"
              value={newMatLocation}
              onChange={(e) => setNewMatLocation(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function MaterialRowEditor({
  idx,
  template,
  groups,
  onRemove,
  onUpdate,
}: {
  idx: number;
  template: MaterialTemplate;
  project: SportsProject;
  groups: string[];
  onRemove: () => void;
  onUpdate: (u: Partial<MaterialTemplate>) => void;
}) {
  return (
    <tr className="hover:bg-slate-50/50 group">
      <td className="px-6 py-3 text-xs text-slate-400">{idx + 1}</td>
      <td className="px-3 py-2.5">
        <input
          value={template.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm font-medium text-slate-700 focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
      </td>
      <td className="px-3 py-2.5">
        <input
          type="number"
          min={0}
          value={template.defaultQuantity}
          onChange={(e) => onUpdate({ defaultQuantity: Math.max(0, parseInt(e.target.value) || 0) })}
          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-center text-sm font-bold text-slate-800 focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
      </td>
      <td className="px-3 py-2.5">
        <input
          value={template.defaultGroup || ''}
          onChange={(e) => onUpdate({ defaultGroup: e.target.value })}
          list={`row-groups-${template.id}`}
          placeholder="选填"
          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-xs text-slate-600 focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
        <datalist id={`row-groups-${template.id}`}>
          {groups.map((g) => <option key={g} value={g} />)}
        </datalist>
      </td>
      <td className="px-3 py-2.5">
        <input
          value={template.defaultLocation || ''}
          onChange={(e) => onUpdate({ defaultLocation: e.target.value })}
          placeholder="选填"
          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-xs text-slate-600 focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
      </td>
      <td className="px-3 py-2.5 text-center">
        <button
          type="button"
          onClick={() => {
            if (confirm(`删除材料「${template.name}」？`)) onRemove();
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
