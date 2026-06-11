import { create } from 'zustand';
import type {
  ActivityInfo,
  AppState,
  FilterOptions,
  MaterialRecord,
  MaterialStatus,
  SportsProject,
  UserRole,
  ValidationResult,
} from '@/types';
import { MOCK_PROJECTS, PRESET_GROUPS, generateId } from '@/utils/mockData';
import { calculateGapLevel } from '@/utils/gapCalculator';
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
} from '@/utils/validation';
import { todayStr } from '@/utils/helpers';

const initialActivity: ActivityInfo = {
  name: '',
  date: todayStr(),
  location: '',
  manager: '',
  remark: '',
};

const initialFilters: FilterOptions = {
  projectIds: [],
  groups: [],
  statuses: [],
  gapLevels: [],
  keyword: '',
};

function runAllValidations(state: AppState): ValidationResult[] {
  const s1 = validateStep1(state.activityInfo);
  const s2 = validateStep2(state.selectedProjectIds);
  const s3 = validateStep3(state.materialRecords);
  const s4 = validateStep4(state.reviewerName, s1, s2, s3);
  return [s1, s2, s3, s4];
}

function buildMaterialRecords(projects: SportsProject[], selectedIds: string[], existingRecords: MaterialRecord[]): MaterialRecord[] {
  const existingMap = new Map(existingRecords.map((r) => [r.templateId, r]));
  const records: MaterialRecord[] = [];
  const now = Date.now();

  projects
    .filter((p) => selectedIds.includes(p.id))
    .forEach((project) => {
      project.materials.forEach((template) => {
        const existing = existingMap.get(template.id);
        if (existing) {
          records.push({
            ...existing,
            projectName: project.name,
            gapLevel: calculateGapLevel(existing.expectedQuantity, existing.actualQuantity),
          });
        } else {
          records.push({
            id: generateId('rec'),
            templateId: template.id,
            name: template.name,
            projectId: project.id,
            projectName: project.name,
            expectedQuantity: template.defaultQuantity,
            actualQuantity: 0,
            responsibleGroup: template.defaultGroup || '',
            location: template.defaultLocation || '',
            damageNote: '',
            status: 'pending',
            gapLevel: 'high' as const,
            updatedAt: now,
          });
        }
      });
    });

  return records;
}

export const useAppStore = create<AppState & {
  setRole: (role: UserRole) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setActivityInfo: (info: Partial<ActivityInfo>) => void;
  toggleProject: (projectId: string) => void;
  selectAllProjects: () => void;
  clearAllProjects: () => void;
  updateMaterialRecord: (id: string, updates: Partial<MaterialRecord>) => void;
  batchUpdateStatus: (ids: string[], status: MaterialStatus) => void;
  batchMarkArrived: (ids: string[]) => void;
  toggleRecordSelect: (id: string) => void;
  selectAllRecords: (ids: string[]) => void;
  clearRecordSelection: () => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  setReviewerName: (name: string) => void;
  setReviewNote: (note: string) => void;
  submitAll: () => void;
  resetAll: () => void;
  toggleManagerPanel: (show?: boolean) => void;
  addProject: (name: string, icon: string) => void;
  removeProject: (id: string) => void;
  addMaterialToProject: (projectId: string, name: string, qty: number, group?: string, location?: string) => void;
  removeMaterialTemplate: (projectId: string, templateId: string) => void;
  updateProject: (id: string, updates: Partial<SportsProject>) => void;
  runValidations: () => void;
  getStepValidation: (step: number) => ValidationResult | undefined;
}>((set, get) => ({
  role: 'executor',
  currentStep: 1,
  activityInfo: initialActivity,
  selectedProjectIds: [],
  materialRecords: [],
  projects: MOCK_PROJECTS,
  presetGroups: PRESET_GROUPS,
  filters: initialFilters,
  selectedRecordIds: [],
  validations: [],
  isSubmitted: false,
  reviewNote: '',
  reviewerName: '',
  showManagerPanel: false,

  setRole: (role) => {
    const state = get();
    const showManagerPanel = role === 'manager' ? state.showManagerPanel : false;
    const validations = runAllValidations({ ...state, role, showManagerPanel });
    set({ role, showManagerPanel, validations });
  },
  setCurrentStep: (step) => {
    const state = get();
    const validations = runAllValidations(state);
    set({ currentStep: step, validations });
  },
  nextStep: () => {
    const state = get();
    if (state.currentStep < 4) {
      const validations = runAllValidations(state);
      const currentValidation = validations.find((v) => v.step === state.currentStep);
      if (currentValidation?.hasError) return;
      set({ currentStep: state.currentStep + 1, validations });
    }
  },
  prevStep: () => {
    const state = get();
    if (state.currentStep > 1) {
      const validations = runAllValidations(state);
      set({ currentStep: state.currentStep - 1, validations });
    }
  },
  setActivityInfo: (info) => {
    set((state) => {
      const newActivity = { ...state.activityInfo, ...info };
      const newState = { ...state, activityInfo: newActivity };
      return { ...newState, validations: runAllValidations(newState) };
    });
  },
  toggleProject: (projectId) => {
    set((state) => {
      const exists = state.selectedProjectIds.includes(projectId);
      const newSelected = exists
        ? state.selectedProjectIds.filter((id) => id !== projectId)
        : [...state.selectedProjectIds, projectId];
      const newRecords = buildMaterialRecords(state.projects, newSelected, state.materialRecords);
      const newState = { ...state, selectedProjectIds: newSelected, materialRecords: newRecords };
      return { ...newState, validations: runAllValidations(newState) };
    });
  },
  selectAllProjects: () => {
    set((state) => {
      const newSelected = state.projects.map((p) => p.id);
      const newRecords = buildMaterialRecords(state.projects, newSelected, state.materialRecords);
      const newState = { ...state, selectedProjectIds: newSelected, materialRecords: newRecords };
      return { ...newState, validations: runAllValidations(newState) };
    });
  },
  clearAllProjects: () => {
    set((state) => {
      const newState = { ...state, selectedProjectIds: [], materialRecords: [] };
      return { ...newState, validations: runAllValidations(newState) };
    });
  },
  updateMaterialRecord: (id, updates) => {
    set((state) => {
      const newRecords = state.materialRecords.map((r) => {
        if (r.id !== id) return r;
        const merged = { ...r, ...updates, updatedAt: Date.now() } as MaterialRecord;
        merged.gapLevel = calculateGapLevel(merged.expectedQuantity, merged.actualQuantity);
        return merged;
      });
      const newState = { ...state, materialRecords: newRecords };
      return { ...newState, validations: runAllValidations(newState) };
    });
  },
  batchUpdateStatus: (ids, status) => {
    set((state) => {
      const newRecords = state.materialRecords.map((r) =>
        ids.includes(r.id) ? { ...r, status, updatedAt: Date.now() } : r,
      );
      const newState = { ...state, materialRecords: newRecords, selectedRecordIds: [] };
      return { ...newState, validations: runAllValidations(newState) };
    });
  },
  batchMarkArrived: (ids) => {
    set((state) => {
      const newRecords = state.materialRecords.map((r) =>
        ids.includes(r.id)
          ? {
              ...r,
              status: 'arrived' as MaterialStatus,
              actualQuantity: r.expectedQuantity,
              gapLevel: 'none' as const,
              updatedAt: Date.now(),
            }
          : r,
      );
      const newState = { ...state, materialRecords: newRecords, selectedRecordIds: [] };
      return { ...newState, validations: runAllValidations(newState) };
    });
  },
  toggleRecordSelect: (id) => {
    set((state) => {
      const exists = state.selectedRecordIds.includes(id);
      return {
        selectedRecordIds: exists
          ? state.selectedRecordIds.filter((i) => i !== id)
          : [...state.selectedRecordIds, id],
      };
    });
  },
  selectAllRecords: (ids) => set({ selectedRecordIds: ids }),
  clearRecordSelection: () => set({ selectedRecordIds: [] }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: initialFilters }),
  setReviewerName: (name) => {
    set((state) => {
      const newState = { ...state, reviewerName: name };
      return { ...newState, validations: runAllValidations(newState) };
    });
  },
  setReviewNote: (note) => set({ reviewNote: note }),
  submitAll: () => {
    const state = get();
    const validations = runAllValidations(state);
    if (validations.some((v) => v.hasError)) {
      set({ validations });
      return;
    }
    set({ isSubmitted: true, validations });
  },
  resetAll: () => {
    set({
      currentStep: 1,
      activityInfo: initialActivity,
      selectedProjectIds: [],
      materialRecords: [],
      selectedRecordIds: [],
      validations: [],
      isSubmitted: false,
      reviewNote: '',
      reviewerName: '',
      filters: initialFilters,
    });
  },
  toggleManagerPanel: (show) => {
    set((state) => ({ showManagerPanel: show ?? !state.showManagerPanel }));
  },
  addProject: (name, icon) => {
    set((state) => ({
      projects: [
        ...state.projects,
        { id: generateId('proj'), name, icon, description: '', materials: [] },
      ],
    }));
  },
  removeProject: (id) => {
    set((state) => {
      const newProjects = state.projects.filter((p) => p.id !== id);
      const newSelected = state.selectedProjectIds.filter((pid) => pid !== id);
      const newRecords = buildMaterialRecords(newProjects, newSelected, state.materialRecords);
      return { projects: newProjects, selectedProjectIds: newSelected, materialRecords: newRecords };
    });
  },
  addMaterialToProject: (projectId, name, qty, group, location) => {
    set((state) => {
      const template = {
        id: generateId('mat'),
        name,
        projectId,
        defaultQuantity: qty,
        defaultGroup: group,
        defaultLocation: location,
      };
      const newProjects = state.projects.map((p) =>
        p.id === projectId ? { ...p, materials: [...p.materials, template] } : p,
      );
      const newRecords = buildMaterialRecords(newProjects, state.selectedProjectIds, state.materialRecords);
      return { projects: newProjects, materialRecords: newRecords };
    });
  },
  removeMaterialTemplate: (projectId, templateId) => {
    set((state) => {
      const newProjects = state.projects.map((p) =>
        p.id === projectId
          ? { ...p, materials: p.materials.filter((m) => m.id !== templateId) }
          : p,
      );
      const newRecords = state.materialRecords.filter((r) => r.templateId !== templateId);
      return { projects: newProjects, materialRecords: newRecords };
    });
  },
  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },
  runValidations: () => {
    const state = get();
    set({ validations: runAllValidations(state) });
  },
  getStepValidation: (step) => get().validations.find((v) => v.step === step),
}));
