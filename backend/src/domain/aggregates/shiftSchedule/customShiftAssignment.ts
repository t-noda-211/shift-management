import {
  EmployeeId,
  ShiftAssignmentDate,
  ShiftAssignmentId,
  ShiftScheduleId,
  ShiftTypeTime,
} from '@/domain/valueObjects'

import { AggregateError } from '../aggregateError'

/**
 * 終業時間が始業時間より前または同じ場合のエラー
 */
export class EndTimeMustBeAfterStartTimeError extends AggregateError {
  constructor() {
    super('End time must be after start time')
  }
}

/**
 * CustomShiftAssignment エンティティ
 * 従業員のカスタム時間のシフト状態を表す
 * イレギュラーな勤務時間を表現する
 */
export class CustomShiftAssignment {
  private constructor(
    public readonly id: ShiftAssignmentId,
    public readonly shiftScheduleId: ShiftScheduleId,
    public readonly date: ShiftAssignmentDate,
    public readonly employeeId: EmployeeId,
    public readonly customStartTime: ShiftTypeTime,
    public readonly customEndTime: ShiftTypeTime
  ) {}

  /**
   * カスタムシフトアサインを作成
   */
  static create(
    shiftScheduleId: ShiftScheduleId,
    date: ShiftAssignmentDate,
    employeeId: EmployeeId,
    customStartTime: ShiftTypeTime,
    customEndTime: ShiftTypeTime
  ): CustomShiftAssignment {
    CustomShiftAssignment.validateEndTimeMustBeAfterStartTime(
      customStartTime,
      customEndTime
    )
    const id = ShiftAssignmentId.create()
    return new CustomShiftAssignment(
      id,
      shiftScheduleId,
      date,
      employeeId,
      customStartTime,
      customEndTime
    )
  }

  /**
   * 既存のカスタムシフトアサインを再構成（リポジトリから復元する際に使用）
   */
  static reconstruct(
    id: ShiftAssignmentId,
    shiftScheduleId: ShiftScheduleId,
    date: ShiftAssignmentDate,
    employeeId: EmployeeId,
    customStartTime: ShiftTypeTime,
    customEndTime: ShiftTypeTime
  ): CustomShiftAssignment {
    CustomShiftAssignment.validateEndTimeMustBeAfterStartTime(
      customStartTime,
      customEndTime
    )
    return new CustomShiftAssignment(
      id,
      shiftScheduleId,
      date,
      employeeId,
      customStartTime,
      customEndTime
    )
  }

  /**
   * 終業時間が始業時間より前または同じ場合のエラーを検証
   */
  private static validateEndTimeMustBeAfterStartTime(
    startTime: ShiftTypeTime,
    endTime: ShiftTypeTime
  ): void {
    if (endTime.toMinutes() <= startTime.toMinutes()) {
      throw new EndTimeMustBeAfterStartTimeError()
    }
  }
}
