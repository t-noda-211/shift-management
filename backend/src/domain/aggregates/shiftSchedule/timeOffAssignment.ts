import {
  EmployeeId,
  ShiftAssignmentDate,
  ShiftAssignmentId,
  ShiftScheduleId,
  TimeOffType,
} from '@/domain/valueObjects'

/**
 * TimeOffAssignment エンティティ
 * 従業員の休日状態を表す
 * 公休・有給休暇などを表現する
 */
export class TimeOffAssignment {
  private constructor(
    public readonly id: ShiftAssignmentId,
    public readonly shiftScheduleId: ShiftScheduleId,
    public readonly date: ShiftAssignmentDate,
    public readonly employeeId: EmployeeId,
    public readonly timeOffType: TimeOffType
  ) {}

  /**
   * 休暇アサインを作成
   */
  static create(
    shiftScheduleId: ShiftScheduleId,
    date: ShiftAssignmentDate,
    employeeId: EmployeeId,
    timeOffType: TimeOffType
  ): TimeOffAssignment {
    const id = ShiftAssignmentId.create()
    return new TimeOffAssignment(
      id,
      shiftScheduleId,
      date,
      employeeId,
      timeOffType
    )
  }

  /**
   * 既存の休暇アサインを再構成（リポジトリから復元する際に使用）
   */
  static reconstruct(
    id: ShiftAssignmentId,
    shiftScheduleId: ShiftScheduleId,
    date: ShiftAssignmentDate,
    employeeId: EmployeeId,
    timeOffType: TimeOffType
  ): TimeOffAssignment {
    return new TimeOffAssignment(
      id,
      shiftScheduleId,
      date,
      employeeId,
      timeOffType
    )
  }
}
