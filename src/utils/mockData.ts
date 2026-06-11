import type { SportsProject } from '@/types';

export const PRESET_GROUPS = ['第一小组', '第二小组', '第三小组', '第四小组', '器材管理组'];

export const MOCK_PROJECTS: SportsProject[] = [
  {
    id: 'proj-1',
    name: '身高体重',
    icon: 'Ruler',
    description: '测量身高体重，计算BMI指数',
    materials: [
      { id: 'mat-1-1', name: '身高体重测量仪', projectId: 'proj-1', defaultQuantity: 4, defaultGroup: '第一小组', defaultLocation: '体育馆A区' },
      { id: 'mat-1-2', name: 'BMI计算表', projectId: 'proj-1', defaultQuantity: 10, defaultGroup: '第一小组', defaultLocation: '体育馆A区' },
      { id: 'mat-1-3', name: '消毒湿巾', projectId: 'proj-1', defaultQuantity: 20, defaultGroup: '器材管理组', defaultLocation: '物资柜1层' },
      { id: 'mat-1-4', name: '记录夹板', projectId: 'proj-1', defaultQuantity: 6, defaultGroup: '第一小组', defaultLocation: '体育馆A区' },
    ],
  },
  {
    id: 'proj-2',
    name: '肺活量',
    icon: 'Wind',
    description: '测试肺通气功能',
    materials: [
      { id: 'mat-2-1', name: '肺活量测试仪', projectId: 'proj-2', defaultQuantity: 6, defaultGroup: '第二小组', defaultLocation: '体育馆B区' },
      { id: 'mat-2-2', name: '一次性吹嘴', projectId: 'proj-2', defaultQuantity: 500, defaultGroup: '器材管理组', defaultLocation: '物资柜2层' },
      { id: 'mat-2-3', name: '医用棉签', projectId: 'proj-2', defaultQuantity: 30, defaultGroup: '器材管理组', defaultLocation: '物资柜2层' },
      { id: 'mat-2-4', name: '记录夹板', projectId: 'proj-2', defaultQuantity: 8, defaultGroup: '第二小组', defaultLocation: '体育馆B区' },
    ],
  },
  {
    id: 'proj-3',
    name: '立定跳远',
    icon: 'PersonStanding',
    description: '测试下肢爆发力',
    materials: [
      { id: 'mat-3-1', name: '立定跳远垫子', projectId: 'proj-3', defaultQuantity: 8, defaultGroup: '第三小组', defaultLocation: '体育馆C区' },
      { id: 'mat-3-2', name: '测量卷尺', projectId: 'proj-3', defaultQuantity: 10, defaultGroup: '第三小组', defaultLocation: '体育馆C区' },
      { id: 'mat-3-3', name: '粉笔', projectId: 'proj-3', defaultQuantity: 15, defaultGroup: '器材管理组', defaultLocation: '物资柜3层' },
      { id: 'mat-3-4', name: '扫帚', projectId: 'proj-3', defaultQuantity: 4, defaultGroup: '器材管理组', defaultLocation: '清洁柜' },
    ],
  },
  {
    id: 'proj-4',
    name: '50米跑',
    icon: 'Timer',
    description: '测试短跑爆发力',
    materials: [
      { id: 'mat-4-1', name: '电子秒表', projectId: 'proj-4', defaultQuantity: 8, defaultGroup: '第四小组', defaultLocation: '田径场器材室' },
      { id: 'mat-4-2', name: '发令枪', projectId: 'proj-4', defaultQuantity: 2, defaultGroup: '第四小组', defaultLocation: '田径场器材室' },
      { id: 'mat-4-3', name: '发令弹', projectId: 'proj-4', defaultQuantity: 50, defaultGroup: '器材管理组', defaultLocation: '保险柜' },
      { id: 'mat-4-4', name: '跑道标志锥', projectId: 'proj-4', defaultQuantity: 20, defaultGroup: '第四小组', defaultLocation: '田径场器材室' },
    ],
  },
  {
    id: 'proj-5',
    name: '坐位体前屈',
    icon: 'StretchHorizontal',
    description: '测试柔韧性',
    materials: [
      { id: 'mat-5-1', name: '坐位体前屈测试仪', projectId: 'proj-5', defaultQuantity: 6, defaultGroup: '第二小组', defaultLocation: '体育馆B区' },
      { id: 'mat-5-2', name: '瑜伽垫', projectId: 'proj-5', defaultQuantity: 12, defaultGroup: '器材管理组', defaultLocation: '物资柜4层' },
      { id: 'mat-5-3', name: '消毒湿巾', projectId: 'proj-5', defaultQuantity: 20, defaultGroup: '器材管理组', defaultLocation: '物资柜1层' },
    ],
  },
  {
    id: 'proj-6',
    name: '引体向上/仰卧起坐',
    icon: 'Dumbbell',
    description: '测试核心与上肢力量',
    materials: [
      { id: 'mat-6-1', name: '单杠', projectId: 'proj-6', defaultQuantity: 6, defaultGroup: '第三小组', defaultLocation: '户外运动区' },
      { id: 'mat-6-2', name: '仰卧起坐垫子', projectId: 'proj-6', defaultQuantity: 20, defaultGroup: '第三小组', defaultLocation: '体育馆C区' },
      { id: 'mat-6-3', name: '计数器', projectId: 'proj-6', defaultQuantity: 12, defaultGroup: '第三小组', defaultLocation: '体育馆C区' },
      { id: 'mat-6-4', name: '防滑镁粉', projectId: 'proj-6', defaultQuantity: 8, defaultGroup: '器材管理组', defaultLocation: '物资柜3层' },
    ],
  },
  {
    id: 'proj-7',
    name: '1000米/800米跑',
    icon: 'Footprints',
    description: '测试耐力素质',
    materials: [
      { id: 'mat-7-1', name: '电子秒表', projectId: 'proj-7', defaultQuantity: 10, defaultGroup: '第四小组', defaultLocation: '田径场器材室' },
      { id: 'mat-7-2', name: '号码布', projectId: 'proj-7', defaultQuantity: 200, defaultGroup: '器材管理组', defaultLocation: '物资柜5层' },
      { id: 'mat-7-3', name: '别针', projectId: 'proj-7', defaultQuantity: 500, defaultGroup: '器材管理组', defaultLocation: '物资柜5层' },
      { id: 'mat-7-4', name: '矿泉水', projectId: 'proj-7', defaultQuantity: 100, defaultGroup: '器材管理组', defaultLocation: '补给站' },
    ],
  },
];

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
