import { EmployeeId } from '@/domain/value-objects/employeeId'
import { ShiftAssignmentDate } from '@/domain/value-objects/shiftAssignmentDate'
import { ShiftAssignmentId } from '@/domain/value-objects/shiftAssignmentId'
import { ShiftScheduleId } from '@/domain/value-objects/shiftScheduleId'
import { ShiftTypeId } from '@/domain/value-objects/shiftTypeId'
import { ShiftTypeTime } from '@/domain/value-objects/shiftTypeTime'
import { TimeOffType } from '@/domain/value-objects/timeOffType'

import { AggregateError } from '../aggregateError'

/**
 * シフトタイプIDとカスタム時刻が両方指定されている、または両方未指定の場合のエラー
 */
export class ShiftTypeIdAndCustomTimeConflictError extends AggregateError {
  constructor() {
    super(
      'Either shiftTypeId or customStartTime/customEndTime must be specified, but not both'
    )
  }
}

/**
 * 休暇種別とカスタム時刻が両方指定されている、または両方未指定の場合のエラー
 */
export class TimeOffTypeAndCustomTimeConflictError extends AggregateError {
  constructor() {
    super(
      'Either timeOffType or customStartTime/customEndTime must be specified, but not both'
    )
  }
}

/**
 * カスタム時刻が一部のみ指定されている場合のエラー
 */
export class CustomTimeIncompleteError extends AggregateError {
  constructor() {
    super('Both customStartTime and customEndTime must be specified together')
  }
}

/**
 * 終業時間が始業時間より前または同じ場合のエラー
 */
export class EndTimeMustBeAfterStartTimeError extends AggregateError {
  constructor() {
    super('End time must be after start time')
  }
}

/**
 * ShiftAssignment エンティティ
 * 従業員のシフトアサインを表す
 * 標準シフト（ShiftType参照）またはカスタムシフト（イレギュラーな勤務時間）を表現する
 */
export class ShiftAssignment {
  private constructor(
    public readonly id: ShiftAssignmentId,
    public readonly shiftScheduleId: ShiftScheduleId,
    public readonly date: ShiftAssignmentDate,
    public readonly employeeId: EmployeeId,
    public readonly shiftTypeId: ShiftTypeId | null,
    public readonly customStartTime: ShiftTypeTime | null,
    public readonly customEndTime: ShiftTypeTime | null,
    public readonly timeOffType: TimeOffType | null
  ) {}

  /**
   * 勤務区分を参照するシフトアサインを作成
   */
  static createWithShiftType(
    shiftScheduleId: ShiftScheduleId,
    date: ShiftAssignmentDate,
    employeeId: EmployeeId,
    shiftTypeId: ShiftTypeId
  ): ShiftAssignment {
    const id = ShiftAssignmentId.create()
    return new ShiftAssignment(
      id,
      shiftScheduleId,
      date,
      employeeId,
      shiftTypeId,
      null,
      null,
      null
    )
  }

  /**
   * カスタム勤務時間のシフトアサインを作成
   */
  static createWithCustomTime(
    shiftScheduleId: ShiftScheduleId,
    date: ShiftAssignmentDate,
    employeeId: EmployeeId,
    customStartTime: ShiftTypeTime,
    customEndTime: ShiftTypeTime
  ): ShiftAssignment {
    ShiftAssignment.validateEndTimeMustBeAfterStartTime(
      customStartTime,
      customEndTime
    )
    const id = ShiftAssignmentId.create()
    return new ShiftAssignment(
      id,
      shiftScheduleId,
      date,
      employeeId,
      null,
      customStartTime,
      customEndTime,
      null
    )
  }

  /**
   * 休暇のシフトアサインを作成
   */
  static createWithTimeOff(
    shiftScheduleId: ShiftScheduleId,
    date: ShiftAssignmentDate,
    employeeId: EmployeeId,
    timeOffType: TimeOffType
  ): ShiftAssignment {
    const id = ShiftAssignmentId.create()
    return new ShiftAssignment(
      id,
      shiftScheduleId,
      date,
      employeeId,
      null,
      null,
      null,
      timeOffType
    )
  }

  /**
   * 既存のシフトアサインを再構成（リポジトリから復元する際に使用）
   */
  static reconstruct(
    id: ShiftAssignmentId,
    shiftScheduleId: ShiftScheduleId,
    date: ShiftAssignmentDate,
    employeeId: EmployeeId,
    shiftTypeId: ShiftTypeId | null,
    customStartTime: ShiftTypeTime | null,
    customEndTime: ShiftTypeTime | null,
    timeOffType: TimeOffType | null
  ): ShiftAssignment {
    // 勤務区分を参照するシフトの場合
    if (shiftTypeId !== null) {
      if (
        customStartTime !== null ||
        customEndTime !== null ||
        timeOffType !== null
      ) {
        throw new ShiftTypeIdAndCustomTimeConflictError()
      }
      return new ShiftAssignment(
        id,
        shiftScheduleId,
        date,
        employeeId,
        shiftTypeId,
        null,
        null,
        null
      )
    }

    // 休暇の場合
    if (timeOffType !== null) {
      if (customStartTime !== null || customEndTime !== null) {
        throw new TimeOffTypeAndCustomTimeConflictError()
      }
      return new ShiftAssignment(
        id,
        shiftScheduleId,
        date,
        employeeId,
        null,
        null,
        null,
        timeOffType
      )
    }

    // カスタムシフトの場合
    if (customStartTime === null || customEndTime === null) {
      throw new CustomTimeIncompleteError()
    }
    ShiftAssignment.validateEndTimeMustBeAfterStartTime(
      customStartTime,
      customEndTime
    )
    return new ShiftAssignment(
      id,
      shiftScheduleId,
      date,
      employeeId,
      null,
      customStartTime,
      customEndTime,
      null
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

  /**
   * 勤務区分を参照するシフトかどうかを判定
   */
  isStandardShift(): boolean {
    return this.shiftTypeId !== null
  }

  /**
   * カスタムシフトかどうかを判定
   */
  isCustomShift(): boolean {
    return this.customStartTime !== null && this.customEndTime !== null
  }

  /**
   * 休暇かどうかを判定
   */
  isTimeOff(): boolean {
    return this.timeOffType !== null
  }
}
