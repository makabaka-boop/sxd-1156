export type UserRole = 'manager' | 'executor' | 'reviewer';

export type MaterialStatus = 'pending' | 'arrived' | 'need_supply' | 'need_review' | 'suspended';

export type GapLevel = 'none' | 'low' | 'medium' | 'high';

export type FollowUpStatus = 'pending' | 'in_progress' | 'completed';

export interface FollowUpInfo {
  person: string;
  expectedTime: string;
  note: string;
  status: FollowUpStatus;
}

export interface MaterialTemplate {
  id: string;
  name: string;
  projectId: string;
  defaultQuantity: number;
  defaultGroup?: string;
  defaultLocation?: string;
}

export interface SportsProject {
  id: string;
  name: string;
  icon: string;
  description?: string;
  materials: MaterialTemplate[];
}

export interface MaterialRecord {
  id: string;
  templateId: string;
  name: string;
  projectId: string;
  projectName: string;
  expectedQuantity: number;
  actualQuantity: number;
  responsibleGroup: string;
  location: string;
  damageNote: string;
  status: MaterialStatus;
  gapLevel: GapLevel;
  followUp: FollowUpInfo | null;
  lastEditor?: string;
  updatedAt: number;
}

export interface ActivityInfo {
  name: string;
  date: string;
  location: string;
  manager: string;
  remark: string;
}

export interface FilterOptions {
  projectIds: string[];
  groups: string[];
  statuses: MaterialStatus[];
  gapLevels: GapLevel[];
  followUpStatuses: FollowUpStatus[];
  keyword: string;
}

export interface ValidationItem {
  field: string;
  message: string;
  recordId?: string;
}

export interface ValidationResult {
  step: number;
  hasError: boolean;
  hasWarning: boolean;
  errors: ValidationItem[];
  warnings: ValidationItem[];
}

export interface AppState {
  role: UserRole;
  currentStep: number;
  activityInfo: ActivityInfo;
  selectedProjectIds: string[];
  materialRecords: MaterialRecord[];
  projects: SportsProject[];
  presetGroups: string[];
  filters: FilterOptions;
  selectedRecordIds: string[];
  validations: ValidationResult[];
  isSubmitted: boolean;
  reviewNote: string;
  reviewerName: string;
  showManagerPanel: boolean;
}
