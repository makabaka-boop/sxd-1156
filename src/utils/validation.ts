import type {
  ActivityInfo,
  MaterialRecord,
  ValidationItem,
  ValidationResult,
} from '@/types';

export function validateStep1(activity: ActivityInfo): ValidationResult {
  const errors: ValidationItem[] = [];
  const warnings: ValidationItem[] = [];

  if (!activity.name?.trim()) {
    errors.push({ field: 'name', message: '活动名称不能为空' });
  } else if (activity.name.length > 50) {
    errors.push({ field: 'name', message: '活动名称不能超过50个字符' });
  }

  if (!activity.date?.trim()) {
    errors.push({ field: 'date', message: '体测日期不能为空' });
  } else if (isNaN(new Date(activity.date).getTime())) {
    errors.push({ field: 'date', message: '请填写有效的日期格式' });
  }

  if (!activity.location?.trim()) {
    errors.push({ field: 'location', message: '举办地点不能为空' });
  } else if (activity.location.length > 100) {
    errors.push({ field: 'location', message: '举办地点不能超过100个字符' });
  }

  if (!activity.manager?.trim()) {
    errors.push({ field: 'manager', message: '总负责人不能为空' });
  } else if (activity.manager.length > 20) {
    errors.push({ field: 'manager', message: '总负责人姓名不能超过20个字符' });
  }

  if (activity.remark?.length > 500) {
    warnings.push({ field: 'remark', message: '备注内容过长（建议500字以内）' });
  }

  return {
    step: 1,
    hasError: errors.length > 0,
    hasWarning: warnings.length > 0,
    errors,
    warnings,
  };
}

export function validateStep2(selectedIds: string[]): ValidationResult {
  const errors: ValidationItem[] = [];
  const warnings: ValidationItem[] = [];

  if (selectedIds.length === 0) {
    errors.push({ field: 'projects', message: '请至少选择一个体测项目' });
  }

  if (selectedIds.length > 10) {
    warnings.push({ field: 'projects', message: '单次活动建议不超过10个体测项目' });
  }

  return {
    step: 2,
    hasError: errors.length > 0,
    hasWarning: warnings.length > 0,
    errors,
    warnings,
  };
}

export function validateStep3(records: MaterialRecord[]): ValidationResult {
  const errors: ValidationItem[] = [];
  const warnings: ValidationItem[] = [];

  if (records.length === 0) {
    errors.push({ field: 'records', message: '暂无材料记录，请返回上一步选择项目' });
    return {
      step: 3,
      hasError: true,
      hasWarning: false,
      errors,
      warnings,
    };
  }

  records.forEach((record) => {
    if (record.actualQuantity < 0 || !Number.isInteger(record.actualQuantity)) {
      errors.push({
        field: 'actualQuantity',
        message: `「${record.name}」实到数量必须为大于等于0的整数`,
        recordId: record.id,
      });
    }

    if (record.actualQuantity < record.expectedQuantity) {
      if (record.status !== 'need_supply' && record.status !== 'suspended') {
        if (!record.damageNote?.trim()) {
          errors.push({
            field: 'damageNote',
            message: `「${record.name}」实到数量少于应到，需填写损坏说明或标记为"需补充"`,
            recordId: record.id,
          });
        } else {
          warnings.push({
            field: 'actualQuantity',
            message: `「${record.name}」实到数量不足（缺口${record.expectedQuantity - record.actualQuantity}）`,
            recordId: record.id,
          });
        }
      }
    }

    if (!record.responsibleGroup?.trim()) {
      errors.push({
        field: 'responsibleGroup',
        message: `「${record.name}」请填写负责小组`,
        recordId: record.id,
      });
    }

    if (!record.location?.trim()) {
      errors.push({
        field: 'location',
        message: `「${record.name}」请填写存放点`,
        recordId: record.id,
      });
    }

    if (record.status === 'suspended' && !record.damageNote?.trim()) {
      errors.push({
        field: 'damageNote',
        message: `「${record.name}」状态为"暂停使用"时必须填写损坏说明`,
        recordId: record.id,
      });
    }
  });

  return {
    step: 3,
    hasError: errors.length > 0,
    hasWarning: warnings.length > 0,
    errors,
    warnings,
  };
}

export function validateStep4(
  reviewerName: string,
  step1Result: ValidationResult,
  step2Result: ValidationResult,
  step3Result: ValidationResult,
): ValidationResult {
  const errors: ValidationItem[] = [];
  const warnings: ValidationItem[] = [];

  if (!reviewerName?.trim()) {
    errors.push({ field: 'reviewerName', message: '请填写复核人姓名' });
  }

  if (step1Result.hasError) {
    errors.push({ field: 'step1', message: '第一步活动信息存在未修正的错误' });
  }
  if (step2Result.hasError) {
    errors.push({ field: 'step2', message: '第二步项目选择存在未修正的错误' });
  }
  if (step3Result.hasError) {
    errors.push({ field: 'step3', message: '第三步材料核对存在未修正的错误' });
  }

  if (step1Result.hasWarning) {
    warnings.push({ field: 'step1', message: `第一步有 ${step1Result.warnings.length} 条提醒` });
  }
  if (step2Result.hasWarning) {
    warnings.push({ field: 'step2', message: `第二步有 ${step2Result.warnings.length} 条提醒` });
  }
  if (step3Result.hasWarning) {
    warnings.push({ field: 'step3', message: `第三步有 ${step3Result.warnings.length} 条提醒` });
  }

  return {
    step: 4,
    hasError: errors.length > 0,
    hasWarning: warnings.length > 0,
    errors,
    warnings,
  };
}

export function hasAnyError(validations: ValidationResult[]): boolean {
  return validations.some((v) => v.hasError);
}
